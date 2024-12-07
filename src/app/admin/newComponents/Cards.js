// ui/dashboard/cards/Cards.js

import Card from "@/app/ui/dashboard/card/card";

const Cards = ({ cards }) => (
  <div className="cards">
    {cards.map((item) => (
      <Card item={item} key={item.id} />
    ))}
  </div>
);

export default Cards;
