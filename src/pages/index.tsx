import React, { useEffect, useState } from "react";
import { get, ref } from "firebase/database";
import { database } from "../../fbconfig";
import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
 
export function DefaultPagination() {
  const [active, setActive] = React.useState(1);
  const getItemProps = (index: Number) =>
    ({
      variant: active === index ? "filled" : "text",
      color: "gray",
      onClick: () => setActive(Number),
    } as any);
  const next = () => {
    if (active === 5) return;
 
    setActive(active + 1);
  };
  const prev = () => {
    if (active === 1) return;
    setActive(active - 1);
  };
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="text"
        className="flex items-center gap-2"
        onClick={prev}
        disabled={active === 1}>
        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
      </Button>
      <div className="flex items-center gap-2">
        <IconButton {...getItemProps(1)}>1</IconButton>
        <IconButton {...getItemProps(2)}>2</IconButton>
        <IconButton {...getItemProps(3)}>3</IconButton>
        <IconButton {...getItemProps(4)}>4</IconButton>
        <IconButton {...getItemProps(5)}>5</IconButton>
      </div>
      <Button variant="text" className="flex items-center gap-2" onClick={next} disabled={active === 5}> Next
      <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
      </Button>
    </div>
  );
}
  
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
              <th className="py-3 px-6">Horário de entrada</th>
              <th className="py-3 px-6">Horário de saída</th>
              <th className="py-3 px-6">Data do registro</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y">
            {Employees.map((Employee) => (
              <tr key={Employee.id} className="divide-x">
                <td className="px-6 py-4 whitespace-nowrap flex items-center gap-x-6">
                  <span>{Employee.id}</span>
                  {Employee.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{Employee.role}</td>
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
