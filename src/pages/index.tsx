import React, { useEffect, useState } from "react";
import { get, ref } from "firebase/database";
import { database } from "../../fbconfig";

export default function TeamMembers(): JSX.Element {
  interface Employee {
    id: string;
    name?: string; 
    role?: string;
    starting_year?: string;
    last_attendance_time?:string;
    gone_in?:string;
    entrance?:string;
  }

  const [Employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const EmployeesRef = ref(database, "Employees");
    get(EmployeesRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const employeesArray = Object.entries(snapshot.val()).map(([id, data]) => ({
            id,
            ...(data && typeof data === "object" ? data : {}),
          }));

          setEmployees(() => employeesArray); // Atualiza o estado usando uma função
        } else {
          console.log("nao encontrou dados a retornar !");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (

    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-50">
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 bg-slate-50">
      <div className="max-w-lg">
        <h3 className="text-gray-800 text-xl font-bold sm:text-2xl text-center">
          Funcionários Registrados
        </h3>
        <p className="text-gray-600 mt-2 text-center">
          Aqui fica os registros
        </p>
      </div>
      <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto border-gray-950">
        <table className="w-full table-auto text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-double border-gray-950">
            <tr className="divide-x">
              <th className="py-3 px-6 text-center">Nome</th>
              <th className="py-3 px-6">Cargo</th>
              <th className="py-3 px-6">Ano que entrou</th>
              <th className="py-3 px-6">Horário de entrada</th>
              <th className="py-3 px-6">Horário de saída</th>
              <th className="py-3 px-6">Data do registro</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y">
            {Employees.map((Employee) => (
              <tr key={Employee.id} className="divide-x">
                <td className="px-6 py-4 whitespace-nowrap flex items-center gap-x-6">
                  <span>{Employee.id + 1}</span>
                  {Employee.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{Employee.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">{Employee.starting_year}</td>
                <td className="px-6 py-4 whitespace-nowrap">{Employee.last_attendance_time}</td>
                <td className="px-6 py-4 whitespace-nowrap">{Employee.gone_in}</td>
                <td className="px-6 py-4 whitespace-nowrap">{Employee.entrance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    
    </main>

  );
}
