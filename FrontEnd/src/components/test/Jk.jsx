import Bu from "./Bu";
import { useState } from "react";

export default function JK() {
  const [counter, setCounter] = useState(0);

    return (
      <div>
      <Bu label="Button 1" color="blue" />
      <Bu label="Button 2" color="green" />
      <Bu label="Button 3" color="yellow" />
      <Bu label="Button 4" color="red" />
      <p>{counter}</p>
        <button onClick={()=> setCounter(counter + 1)}>+</button>
    </div>
  );
}