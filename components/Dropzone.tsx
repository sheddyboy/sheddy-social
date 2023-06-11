import Image from "next/image";
import { useCallback } from "react";
import { FileRejection, useDropzone } from "react-dropzone";

interface DropzoneProps {
  dropZoneRef: React.RefObject<HTMLInputElement>;
  files: NewFile[] | null;
  setFiles: React.Dispatch<React.SetStateAction<NewFile[] | null>>;
}

export type NewFile = File & { preview: string; id: string };

export default function Dropzone({
  dropZoneRef,
  setFiles,
  files,
}: DropzoneProps) {
  const removeImage = (id: string) => {
    if (!files) return;
    setFiles(files.filter((file) => file.id !== id));
  };

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      console.log("acceptedFiles", acceptedFiles);
      console.log("rejectedFiles", rejectedFiles);
      acceptedFiles.map((file) => {
        return Object.assign(file, { preview: URL.createObjectURL(file) });
      });
      setFiles((files) => {
        if (files) {
          const availableSpace = 4 - files.length;
          console.log("availableSpace", availableSpace);
          console.log("acceptedFiles", acceptedFiles.length);
          if (availableSpace === 0 || acceptedFiles.length > availableSpace)
            return files;

          return [
            ...files,
            ...acceptedFiles.map((file) => {
              return Object.assign(file, {
                preview: URL.createObjectURL(file),
                id: Math.random().toString(),
              });
            }),
          ];
        } else {
          return acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
              id: Math.random().toString(),
            })
          );
        }
      });
    },
    [setFiles]
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxSize: 1024 * 5000,
    multiple: true,
    maxFiles: 4,
  });

  return (
    <>
      <div {...getRootProps({})}>
        <input {...getInputProps({ name: "photos", ref: dropZoneRef })} />
      </div>
      <ul className="flex gap-3 overflow-scroll mt-2">
        {files?.map((file) => (
          <li key={file.id}>
            <div className="relative w-24 h-24 rounded-md overflow-hidden">
              <Image
                src={file.preview}
                alt=""
                fill={true}
                className="object-cover object-top"
              />
              <button
                type="button"
                className="text-white absolute right-0 top-0 leading-none rounded-full bg-red-400 text-[8px] w-3 h-3 flex justify-center items-center"
                onClick={() => {
                  removeImage(file.id);
                }}
              >
                X
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
