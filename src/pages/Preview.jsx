import React from "react";
import PreviewCard from "../components/PreviewCard";
import { useParams } from "react-router-dom";
import { getAllClothing } from "../../data";

const Preview = () => {
  const { id } = useParams();
  const shoeId = Number(id);
  const [dataAvailability, setDataAvailability] = React.useState(false);
  const [data, setData] = React.useState();

  getAllClothing().then(
    (res) => {
      const sneakers = res.Items
      const filteredItems = sneakers.filter(
        (s) => s.retail_price_cents.N !== null && s.story_html.S !== null
      );
      const qtyUpdate = filteredItems.map((item) => {
        return { ...item, qty: 1 };
      });
      const item = qtyUpdate.filter((item) => Number(item.id.N) === shoeId)[0];
      setData(item);
      setDataAvailability(true)
    }
  )

  return dataAvailability === false ? (<div>
    <h2>Still loading...</h2>
  </div>) : (
    <div className="">
      <PreviewCard shoe={data} />
    </div>
  );
};

export default Preview;
