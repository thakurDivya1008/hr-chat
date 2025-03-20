import { randomColor } from "@/utils/strings";

const Usertag = ({ name, img }) => {
  const generateDisplayImg = () => {
    let color = randomColor();
    return (
      <div
        className="flex items-center w-[24px] h-[24px] rounded-[20px]"
        style={{ background: color }}
      >
        <span className="text-center m-auto text-white"> {name?.charAt(0)}</span>
      </div>
    );
  };
  return (
    <div
      className={`flex items-center w-fit rounded-[20px] gap-[5px] ps-[4px] pe-[10px] py-[5px]  border`}
    >
      {img ? <img src={img} alt="" className="user" /> : generateDisplayImg()}
      <p>{name}</p>
    </div>
  );
};

const Tag = ({ children, color, textColor, classNames, style }) => {

  return (
    <div
      className={` ${classNames}  `}
     
    >
      {children}
    </div>
  );
};

export {Usertag,Tag}
