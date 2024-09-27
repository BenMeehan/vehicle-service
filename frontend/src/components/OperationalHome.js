import React, { useState, useEffect } from "react";
import { getAllComponents, newComponent } from "./api";
import Navbar from "./Navbar";
import RevenueGraph from "./RevenueGraph";

const OperationalHome = () => {
  const [componentName, setComponentName] = useState("");
  const [repairPrice, setRepairPrice] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [components, setComponents] = useState([]);

  useEffect(() => {
    getAllComponents()
      .then((response) => {
        setComponents(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the components!", error);
      });
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    const componentData = {
      component_name: componentName,
      repair_price: parseFloat(repairPrice),
      new_price: parseFloat(newPrice),
    };

    newComponent(componentData)
      .then((response) => {
        setComponents([...components, response.data]);
        setComponentName("");
        setRepairPrice("");
        setNewPrice("");
      })
      .catch((error) => {
        console.error("There was an error registering the component!", error);
      });
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2 className="text-center">Operational Dashboard</h2>
        <form onSubmit={handleRegister} className="mb-5">
          <div className="form-group">
            <label>Component Name</label>
            <input
              type="text"
              className="form-control"
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Repair Price</label>
            <input
              type="number"
              className="form-control"
              value={repairPrice}
              onChange={(e) => setRepairPrice(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>New Price</label>
            <input
              type="number"
              className="form-control"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary mt-3">
            Register Component
          </button>
        </form>

        <h3>Registered Components</h3>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Component Name</th>
              <th>Repair Price</th>
              <th>New Price</th>
            </tr>
          </thead>
          <tbody>
            {components.map((component) => (
              <tr key={component.id}>
                <td>{component.component_name}</td>
                <td>{component.repair_price}</td>
                <td>{component.new_price}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <RevenueGraph />
      </div>
    </>
  );
};

export default OperationalHome;
