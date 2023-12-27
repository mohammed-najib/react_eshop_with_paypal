const NavLinksComponent = () => {
  return (
    <div className="flex gap-32 justify-between text-[#999]">
      <a href="#" className="py-4 px-16 first-letter:capitalize">
        types
      </a>
      <a
        href="#"
        className="py-4 px-16 bg-[#ffe8a9] first-letter:capitalize font-semibold text-[#343434]"
      >
        price
      </a>
      <a href="#" className="py-4 px-16 first-letter:capitalize">
        connect
      </a>
    </div>
  )
}

export default NavLinksComponent
