import React from 'react';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ headers, children, className = '' }) => {
  return (
    <div className={`w-full overflow-x-auto rounded-xl border-3 border-neo-dark shadow-neo bg-white ${className}`}>
      <table className="w-full text-left border-collapse font-jakarta">
        <thead>
          <tr className="bg-neo-yellow border-b-3 border-neo-dark">
            {headers.map((head, idx) => (
              <th
                key={idx}
                className="px-4 py-3.5 font-space font-extrabold text-xs uppercase tracking-wider text-neo-dark border-r-2 border-neo-dark last:border-r-0 whitespace-nowrap"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-neo-dark">
          {children}
        </tbody>
      </table>
    </div>
  );
};
