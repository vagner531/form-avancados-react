import "./styles/global.css";

import { useForm } from 'react-hook-form'

function createUser(data: any) {
  console.log(data)
}

export function App() {
    const { register, handleSubmit } = useForm();

  return (
    <main className="h-screen bg-zinc-950 text-zinc-300 flex items-center justify-center">
      <form onSubmit={handleSubmit(createUser)} className="flex flex-col gap-4 w-full max-w-xs">
        <div className="flex flex-col gap-1">
          <label htmlFor="">E-mail</label>
          <input 
            type="email" 
            className="border-zinc-200 shadow-sm rounded h-10"
            {...register('email')}
            />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="">Senha</label>
          <input 
            type="password" 
            className="border-zinc-200 shadow-sm rounded h-10"
            {...register('password')}
            />
        </div>

        <button 
          type="submit"
          className="bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600"
        >
          Salvar
        </button>
      </form>
    </main>
  );
}
