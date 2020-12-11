import React from "react"

const Footer = () => {
  return (
    <div className="footer text-center pb-2 ">
      <div className="sm:text-sm text-xs">
        Created by{" "}
        <a href="https://heystevegray.dev/" target="_blank">
          Steve Gray
        </a>{" "}
        © {new Date().getFullYear()}
      </div>
    </div>
  )
}

export default Footer
