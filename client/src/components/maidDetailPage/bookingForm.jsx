import React from "react";
import { RiArrowDropDownFill } from "react-icons/ri";
import { BiRupee } from "react-icons/bi";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
function BookingForm(props) {
  const [display, setdisplay] = React.useState("none");
  const [services, setservices] = React.useState("");
  const [servicesNumber, setservicesNumber] = React.useState(0);
  const [startingDate, setstartingDate] = React.useState();

  const handleClickForInput = (e) => {
    let newArray = [];
    const arrayOfBoxes = Array.from(
      e.target.parentElement.parentElement.children
    );
    let count = 0;
    arrayOfBoxes.map((el) => {
      if (el.nodeName === "LABEL" && el.children[0].checked === true) {
        newArray.push(el.children[0].value);
        count++;
      }
      return 0;
    });

    setservices(newArray);
    setservicesNumber(count);
  };

  const stripe = loadStripe(
    "pk_test_51KcucRSDevBPU9EzckceCZBrURlXRK2A0GuoFtlkj8FFIvK8t4KqjfahiCnGo5XoSLAEeKYdcUcJHzciWd9LI4Dx005zmvHH6u"
  );
  const url = `http://localhost:3000/api/v1/bookings/checkout-session/${props.maid._id}`;

  const handleClick = async () => {
    if (startingDate === undefined || servicesNumber === 0) {
      alert("Please choose staring work date and services needed! ");
      return;
    }
    try {
      const session = await axios({
        method: "POST",
        url: url,
        data: { startingDate, services },
      });
      await stripe.redirectToCheckout({ sessionId: session.id });
    } catch (err) {
      console.log(err.response);
      alert("Could not complete the payment! Please try again later");
    }
  };
  return (
    <>
      <div className="bookingForm">
        <div className="formData">
          <p style={{ margin: 0, fontSize: "large" }}>Starting Date: </p>
          <input
            type="date"
            style={{ marginLeft: "-10px" }}
            min={new Date().toISOString().slice(0, 10)}
            max={new Date(
              new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000)
            )
              .toISOString()
              .slice(0, 10)}
            onChange={(e) => setstartingDate(e.target.value)}
          />
          <div
            className="dropdown"
            onClick={(e) => {
              display === "none" ? setdisplay("block") : setdisplay("none");
            }}
          >
            Choose Services <RiArrowDropDownFill />
            <div className="values" style={{ display: display }}>
              {props.maid.services ? (
                props.maid.services.map((service) => {
                  return (
                    <>
                      <label className="light">
                        <input
                          type="checkbox"
                          name="services"
                          value="Cooking"
                          onClick={handleClickForInput}
                        />{" "}
                        {service}
                      </label>
                      <br />
                    </>
                  );
                })
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        <div className="priceShow">
          <div className="price1">
            <p
              style={{
                fontSize: "smaller",
                fontWeight: "lighter",
                margin: 0,
              }}
            >
              per service
            </p>
            <p
              style={{
                fontSize: "larger",
                fontWeight: "bold",
                margin: 0,
                textAlign: "center",
              }}
            >
              <BiRupee /> {props.maid.price}
            </p>
          </div>
          <p style={{ margin: 0, alignSelf: "end", fontSize: "x-large" }}>X</p>
          <div className="price1">
            <p
              style={{
                fontSize: "smaller",
                fontWeight: "lighter",
                margin: 0,
              }}
            >
              services
            </p>
            <p
              style={{
                fontSize: "larger",
                fontWeight: "bold",
                margin: 0,
                textAlign: "center",
              }}
            >
              {servicesNumber}
            </p>
          </div>
          <p style={{ margin: 0, alignSelf: "end", fontSize: "x-large" }}>=</p>
          <div className="price1">
            <p
              style={{
                fontSize: "smaller",
                fontWeight: "lighter",
                margin: 0,
              }}
            >
              Total
            </p>
            <p
              style={{
                fontSize: "larger",
                fontWeight: "bold",
                margin: 0,
                textAlign: "center",
              }}
            >
              <BiRupee />
              {servicesNumber * props.maid.price}
            </p>
          </div>
        </div>
        <button className="book" onClick={handleClick}>
          Book
        </button>
      </div>
    </>
  );
}

export default BookingForm;
