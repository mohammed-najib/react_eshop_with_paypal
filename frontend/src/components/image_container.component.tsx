import SofaImg from "../assets/sofa.png"

const ImageContainerComponent = () => {
  return (
    <div className="absolute top-[30%] left-[-100px]">
      <img src={SofaImg} alt="sofa" />
    </div>
  )
}

export default ImageContainerComponent
