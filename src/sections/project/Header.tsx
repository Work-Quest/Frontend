type Props = {
  bgColor: string;
  textColor: string;
  text: string;
};

const Header = ({ bgColor, textColor, text }: Props) => (
  <div
    className={`self-stretch px-6 py-2 inline-flex justify-start items-center gap-2.5 ${bgColor}`}
  >
    <h3 className={`justify-start ${textColor}`}>{text}</h3>
  </div>
);

export default Header;
