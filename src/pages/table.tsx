import React, { useEffect, useState} from "react";
import { get, ref} from "firebase/database";
import { database } from "../../fbconfig";
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css'
import Table from "react-bootstrap/Table";
import { Nav, Navbar } from "react-bootstrap";
import { NavDropdown } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";


export default function Index(): JSX.Element {

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
      
    const [Employees, setEmployees] = useState<Employee[]>([]);
  
    
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
    const MyDropdown = ({ dailyRecords }: { dailyRecords: { [date: string]: { entrance: string; exit: string; }; }; }) => {
        const dailyRecordDates = dailyRecords ? Object.keys(dailyRecords) : [];
      
        return (
          <Dropdown>
            <Dropdown.Toggle variant="outline-dark" id="dropdown-basic" style={{ width: '200px' }}>
              Selecione a data
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {dailyRecordDates.map((date, index) => (
                <Dropdown.Item key={index} href="#/action-1">{date}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        );
      };
      

    return (
     <Container fluid className="mt-5 ">
         <Navbar expand="lg" className="bg-body-tertiary"  >
      <Container fluid style={{ padding: 0 }}> 
        <Navbar.Collapse id="navbarScroll" style={{ padding: 0 }} >
          <Form className="d-flex mr-auto" style={{ whiteSpace: 'nowrap', padding: 0 }}>
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-dark">Procure pelo servidor</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
        <div className="d-flex justify-content-center">
        <Table bordered striped className="w-70" >

            <thead className="text-center" >
                <tr>
                     <th>#</th>
                     <th>Nome</th>
                     <th>Cargo</th>
                     <th>Horário de entrada</th>
                     <th>Horário de saída</th>
                     <th>Data de Registro</th>
                    </tr></thead>
                    <tbody className="text-center">
                    {Employees.map((employee) => (
    <tr key={employee.id} className="divide-x">
      <td><span>{employee.id}</span></td>
      <td>{employee.name}</td>
      <td>{employee.role}</td>
      <td>{employee.last_attendance_time}</td>
      <td>{employee.gone_in}</td>
      <td>
        <MyDropdown dailyRecords={employee.daily_records} />
      </td>
    </tr>
  ))}
          </tbody>
                     </Table>
        </div>
       
     </Container>
    )
}