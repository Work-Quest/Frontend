type Props = {
  bgColor: string;
  textColor: string;
};

const Header = ({ bgColor, textColor }: Props) => (
  <div
    className={`self-stretch px-6 py-2 inline-flex justify-start items-center gap-2.5 ${bgColor}`}
  >
    <h3 className={`justify-start ${textColor}`}>Project's Detail</h3>
  </div>
);

export default Header;
