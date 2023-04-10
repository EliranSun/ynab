import classNames from "classnames";

const Button = ({ children, onClick, isDisabled }) => {
    return (
        <button
            onClick={onClick}
            disabled={isDisabled}
            className={classNames("w-32 cursor-pointer", {
                "opacity-50 cursor-not-allowed": isDisabled,
            })}
            style={{
                backgroundColor: isDisabled ? "lightgray" : "lightblue",
                border: "none",
                padding: "5px 10px",
                borderRadius: "5px",
            }}
        >
            {children}
        </button>
    );
};

export default Button;