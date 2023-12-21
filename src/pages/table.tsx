import React, { useEffect, useState} from "react";
import { get, ref} from "firebase/database";
import { database } from "../../fbconfig";
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css'
import Table from "react-bootstrap/Table";
import {Dropdown, Pagination } from "react-bootstrap";
import styled from "@emotion/styled";
interface Employee {
  id: string;
  name?: string;
  role?: string;
  starting_year?: string;
  last_attendance_time?: string;
  gone_in?: string;
  daily_records: {
    [date: string]: {
      entrance: string;
      exit: string;
    };
  };
}
interface MyDropdownProps {
  dates: string[];
}

interface MyComponentProps {
  Employees: Employee[];
  allDailyRecordDates: string[];
}

const CustomTable = styled(Table)`
  .thead {
    backgroundColor: "darkblue";
  }
`;

const MyDropdown = ({ dates }: MyDropdownProps) => {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="dark" id="dropdown-basic">
        Selecione a data
      </Dropdown.Toggle>
      <Dropdown.Menu data-bs-theme="light">
        {dates.map((date, index) => (
          <Dropdown.Item key={index} href="#/action-1" data-bs-theme="dark">{date}</Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};
const getAllDates = (employees: Employee[]): string[] => {
  const allDates = new Set<string>(); // Especifica que allDates é um Set de strings
  employees.forEach(employee => {
    Object.keys(employee.daily_records || {}).forEach(date => {
      allDates.add(date);
    });
  });
  return Array.from(allDates);
}
const MyComponent = ({ Employees, allDailyRecordDates }: MyComponentProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentItems = Employees.slice(firstIndex, lastIndex);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  let items = [];
  for (let number = 1; number <= Math.ceil(Employees.length / itemsPerPage); number++) {
    items.push(
      <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
        {number}
      </Pagination.Item>,
    );
  }
  return (
    <div>
     <CustomTable variant="light" bordered striped className="mt-5 custom-table" style={{ marginBottom: '2px', overflow: 'hidden', borderRadius: '10px' }}>
        <thead  className="text-center"   >
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Cargo</th>
            <th>Horário de entrada</th>
            <th>Horário de saída</th>
            <th>
              <MyDropdown dates={allDailyRecordDates} />
            </th>
          </tr>
        </thead>
        <tbody className="text-center">
          {currentItems.map((employee: Employee) => (
            <tr key={employee.id} className="divide-x">
              <td><span>{employee.id}</span></td>
              <td>{employee.name}</td>
              <td>{employee.role}</td>
              <td>{employee.last_attendance_time}</td>
              <td>{employee.gone_in}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </CustomTable>
      <div className="d-flex justify-content-end">
        <Pagination>{items}</Pagination>
      </div>
    </div>
  );
};
export default function Index(): JSX.Element {
    const [Employees, setEmployees] = useState<Employee[]>([]);
    const allDailyRecordDates: string[] = getAllDates(Employees); // allDailyRecordDates é um array de strings
    useEffect(() => {
        const EmployeesRef = ref(database, "Employees");
        get(EmployeesRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const employeesArray = Object.entries(snapshot.val()).map(([id, data]) => {
                    // 'data' é tratado como um objeto que segue a estrutura da interface 'Employee'
                    const employeeData = data as Employee;
    
                    return {
                        id,
                        name: employeeData.name || "",
                        role: employeeData.role || "",
                        starting_year: employeeData.starting_year || "",
                        last_attendance_time: employeeData.last_attendance_time || "",
                        gone_in: employeeData.gone_in || "",
                        daily_records: employeeData.daily_records || {},
                    };
                });
                setEmployees(employeesArray);
            } else {
                console.log("Nao existem ou nao foram econtrados dados a retornar!");
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);    
    return (
      <Container className="mt-5" style={{ backgroundColor: "royalblue" }}>
  <Container fluid className="mt-5" >
      
      <div className="d-flex justify-content-center " style={{ margin: 0 }} >
          <MyComponent Employees={Employees} allDailyRecordDates={allDailyRecordDates} />
      </div>      
  </Container>
      </Container>
    
  )
}
