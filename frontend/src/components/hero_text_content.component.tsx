import PayPalPaymentComponent from "./paypal_payment.component"

const HeroTextContentComponent = () => {
  return (
    <div className="flex flex-col gap-8 items-start">
      <h1 className="capitalize text-7xl font-bold">wood candy sofa</h1>
      <p className="text-[#999]">
        Yonah Creative Studio from Spain has won many design awards such as iF
        and red dot. Complexity and simplicity are not Yonoh's definition of
        design.
      </p>
      <strong className="text-2xl font-semibold">$399.00</strong>
      {/* <button className="bg-[#ffe8a9] px-8 py-2 first-letter:capitalize">
        buy now
      </button> */}
      <PayPalPaymentComponent />
    </div>
  )
}

export default HeroTextContentComponent
