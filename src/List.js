import React, { useEffect, useState } from "react";
import "./List.css";
import { v4 as uuidv4 } from "uuid";

const List = () => {
  const today = new Date().toLocaleDateString();

  const addPrice = (e) => {
    const id = e.target.getAttribute("data-id");

    const item = data.find((item) => {
      console.log("item id", item.id);
      return item.id === id && item.price === "";
    });

    if (item && item.price === "") {
      let itemPrice = prompt("Enter a new price for the item (Ft):");

      if (isNaN(Number(itemPrice)) || !itemPrice) return; // Érvényességi ellenőrzés

      setData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, price: itemPrice, checked: true } : item
        )
      );

      setSum((prevSum) => {
        const currentPrice = data.find((item) => item.id === id)?.price || 0;
        return prevSum - Number(currentPrice) + Number(itemPrice);
      });
    } else {
      alert("This item already has a price.");
    }
  };
  const [checkedItems, setCheckedItems] = useState({});

  const handleCheckboxChange = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const [checked, setChecked] = useState(false);
  const [data, setData] = useState([]);
  const [sum, setSum] = useState(0);

  const createItem = () => {
    let newItemName = prompt("New item");
    if (!newItemName) return;
    const itemPrice = prompt("Price of the item (Ft)");
    if (isNaN(Number(itemPrice))) return;
    const newItem = { name: newItemName, price: itemPrice, id: uuidv4() };
    const newData = [...data, newItem];
    setData(newData);
    setSum((prevSum) => Number(prevSum) + Number(newItem.price));
    console.log(newData);
  };
  const getData = () => {
    fetch("/data.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((myJson) => {
        console.log(myJson);
        setData(myJson);
        const totalSum = myJson.reduce(
          (acc, element) => acc + Number(element.price),
          0
        );
        setSum(totalSum);
      });
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className="header">
        <p id="date">Date: {today}</p>
        <button id="desktop" onClick={createItem}>
          Add
        </button>
        <p>Total Amount: {sum}</p>
        <button id="mobile" onClick={createItem}>
          Add
        </button>
      </div>
      <div className="List">
        <ul>
          {data.length > 0 ? (
            data.map((item, index) => (
              <li
                key={index}
                style={{
                  textDecoration: item.checked ? "line-through" : "none",
                }}
              >
                <input
                  type="checkbox"
                  data-id={item.id}
                  checked={item.checked || false}
                  onChange={
                    (e) => addPrice(e)
                    // item.price ? () => handleCheckboxChange(item.id) : addPrice
                  }
                />{" "}
                {item.name} - {item.price} Ft
              </li>
            ))
          ) : (
            <li>Loading...</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default List;
