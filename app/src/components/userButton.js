import React, { useState, useEffect } from "react";



const painel = [
  { section: 'new', name: 'Compras', href: '/productsList' },
  { section: 'new', name: 'Lista de Desejos', href: '/addProducts' },
  { section: 'new', name: 'Historico', href: '/cart' },
  { section: 'new', name: 'Company', href: '/' },
]

function UserButton({ info }) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="flex flex-col items-end">

      <button onClick={() => setIsActive(!isActive)} className="flex flex-row-reverse gap-x-3 items-center py-1 px-1 rounded-3xl border border-gray-300 shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10 opacity-60">
          <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
        </svg>
        <div className="ml-3">
        {info}
        </div>
      </button>

      <div className={ isActive ? "flex relative z-50" : "hidden"}>
      {/* PAINEL ITENS */}
      <div className="flex flex-col text-right gap-y-6">
        {painel.map((item) => (
          <a key={item.name} href={item.href} className="text-sm/6 font-semibold text-gray-900">
            {item.name}
          </a>
        ))}
      </div>
      </div>

    </div>
  );
}

export default UserButton;
