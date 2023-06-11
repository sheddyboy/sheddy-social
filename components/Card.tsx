interface CardProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

export default function Card({ children, noPadding }: CardProps) {
  return (
    <div
      className={`bg-white shadow-md shadow-gray-300 rounded-md ${
        !noPadding && "p-4"
      } mb-5`}
    >
      {children}
    </div>
  );
}
