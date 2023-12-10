import React from "react";
import Card from "../components/Card";
import { getAllClothing } from "../../data";

const Explore = () => {
  const [dataAvailability, setDataAvailability] = React.useState(false);
  const [data, setData] = React.useState();
  getAllClothing().then(
    (res) => {
      const sneakers = res.Items
      const filteredItems = sneakers.filter(
        (s) => s.retail_price_cents.N !== null && s.story_html.S !== null
      );
      setData(filteredItems.map((item) => {
        return { ...item, qty: 1 };
      }));
      setDataAvailability(true)
    }
  )

  return dataAvailability === false ? (<div>
    <h2>Still loading...</h2>
  </div>) : (
        <div className="">
          <div className="w-full min-h-fit p-10 md:p-20 grid grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-6 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4 xl:gap-10mx-auto ">
            {data.map((shoe, idx) => (
              <Card key={shoe.id.N} shoe={shoe} />
            ))}
          </div>
        </div>
      );
  
};

export default Explore;
