import { OnApproveData } from "@paypal/paypal-js/types/components/buttons"
import { PayPalButtons } from "@paypal/react-paypal-js"

const PayPalPaymentComponent = () => {
  const serverUrl = "http://localhost:3000"

  const createOrder = async () => {
    try {
      const response = await fetch(`${serverUrl}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // use the "body" param to optionally pass additional order information
        // like product ids and quantities
        body: JSON.stringify({
          product: {
            description: "Wood Candy Sofa",
            price: "399.00",
          },
        }),
      })

      const order = await response.json()

      return order.id
    } catch (error) {
      console.error(error)
    }
  }

  function onApprove(data: OnApproveData) {
    return fetch(`${serverUrl}/api/orders/${data.orderID}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((orderData) => {
        const name = orderData.payer.name.given_name
        alert(`Transaction completed by ${name}`)
      })
  }

  return (
    <PayPalButtons
      style={{
        layout: "vertical",
        shape: "rect",
        color: "silver",
        label: "buynow",
      }}
      createOrder={createOrder}
      onApprove={onApprove}
    />
  )
}

export default PayPalPaymentComponent
