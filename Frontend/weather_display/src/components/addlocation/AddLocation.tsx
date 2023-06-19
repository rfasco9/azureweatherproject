import { useState } from "react";

function AddLocation(props: any) {

  const [zipCode, setZipCode] = useState('')

  const handleSubmit = () => {
    props.addLocation(zipCode)
    setZipCode('')

  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZipCode(e.target.value)
  }

  const handleKey = (e: any) => {
    if (e.key == 'Enter') {
      handleSubmit();
    }
  }

    return (
      <div>
        <h3>Add Location</h3>
        <label htmlFor="zip">Please enter your zip code</label><br/>
        <input type="text" name="zip" id="zipinput" onChange={handleChange} onKeyDown={handleKey} value={zipCode}/>
        <button onClick={handleSubmit}>Add Location</button>
      </div>
    );
  }
  
  export default AddLocation;
  