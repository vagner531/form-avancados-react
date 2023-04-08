import { useState } from "react";
import "./styles/global.css";

import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "./lib/supabase";

const createUserFormSchema = z.object({
  avatar: z.instanceof(FileList)
  .transform(list => list.item(0)!)
  .refine(file => file!.size <= 5 * 1024 * 1024, 'O arquivo precisa ter no maximo 5mb'),
  name: z
    .string()
    .nonempty("O nome é obrigatório")
    .transform((name) => {
      return name
        .trim()
        .split(" ")
        .map((word) => {
          return word[0].toLocaleUpperCase().concat(word.substring(1));
        })
        .join(" ");
    }),
  email: z
    .string()
    .nonempty("O e-mail é obrigatório")
    .email("Formato de e-mail inválido")
    .toLowerCase(),
  password: z.string().min(6, "A senha precisa de no minimo 6 caracteres"),
  techs: z
    .array(
      z.object({
        title: z.string().nonempty("O titulo é obrigatório"),
        knowledge: z.coerce.number().min(1).max(100),
      })
    )
    .min(2, "Insira pelo menos 2 tecnologias"),
});

type CreateUserFormData = z.infer<typeof createUserFormSchema>;

export function App() {
  const [output, setOutput] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "techs",
  });

  function addNewTech() {
    append({ title: "", knowledge: 0 });
  }

  async function createUser(data: CreateUserFormData) {
   await supabase.storage.from('forms-react').upload(
      data.avatar.name, 
      data.avatar
      )

    setOutput(JSON.stringify(data, null, 2));
  }

  return (
    <main className="h-screen bg-zinc-950 text-zinc-300 flex flex-col gap-10 items-center justify-center">
      <form
        onSubmit={handleSubmit(createUser)}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="">Avatar</label>
          <input
            type="file"
            accept="image/*"
            className="border-zinc-800 shadow-sm rounded h-10  text-white"
            {...register("avatar")}
          />
          {errors.avatar && (
            <span className="text-red-500 text-sm">{errors.avatar.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="">Nome</label>
          <input
            type="name"
            className="border-zinc-800 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white"
            {...register("name")}
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="">E-mail</label>
          <input
            type="email"
            className="border-zinc-800 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white"
            {...register("email")}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="">Senha</label>
          <input
            type="password"
            className="border-zinc-800 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white"
            {...register("password")}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="" className="flex items-center justify-between">
            Tecnologias
            <button
              type="button"
              onClick={addNewTech}
              className="text-emerald-500 text-sm"
            >
              Adicionar
            </button>
          </label>
          {fields.map((field, index) => {
            return (
              <div className="flex gap-2" key={field.id}>
                <div className="flex-1 flex flex-col gap-1">
                  <input
                    type="text"
                    className=" border-zinc-800 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white"
                    {...register(`techs.${index}.title`)}
                  />
                  {errors.techs?.[index]?.title && (
                    <span className="text-red-500 text-sm">
                      {errors.techs?.[index]?.title?.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <input
                    type="number"
                    className="w-16 flex-1 border-zinc-800 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white"
                    {...register(`techs.${index}.knowledge`)}
                  />
                  {errors.techs?.[index]?.knowledge && (
                    <span className="text-red-500 text-sm">
                      {errors.techs?.[index]?.knowledge?.message}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          {errors.techs && (
            <span className="text-red-500 text-sm">{errors.techs.message}</span>
          )}
        </div>
        <button
          type="submit"
          className="bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600"
        >
          Salvar
        </button>
      </form>
      <pre>{output}</pre>
    </main>
  );
}
