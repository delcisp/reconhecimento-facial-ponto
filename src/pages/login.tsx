import React, { useEffect, useState } from "react";
import { get, ref } from "firebase/database";
import { database } from "../../fbconfig";

interface Employee {
  id: string;
  name?: string; 
  role?: string;
  starting_year?: string;
}

const IndexPage = () => {
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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="grid grid-cols-3 gap-4">
        {Employees.map((Employee) => (
          <div key={Employee.id} className="bg-gray-100 p-4 rounded-lg">
            <p>NOME: {Employee.name}</p>
            <p> CARGO: {Employee.role} </p>
            <p> ANO DE INÍCIO: {Employee.starting_year} </p>
          </div>
        ))}
      </div>
      
    </main>
  );
}

export default IndexPage;
