import React from "react"

const Footer = () => {
  return (
    <div className="footer mt-4 text-center pb-2">
      <div className="text-xs">
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
