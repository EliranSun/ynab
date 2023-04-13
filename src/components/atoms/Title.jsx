import classNames from "classnames";

const Title = ({ children, type, className, ...rest }) => {
    switch (type) {
        default:
        case "h1":
            return <h1 className={classNames("text-6xl my-4", className)} {...rest}>{children}</h1>;
        case "h2":
            return <h2 className={classNames("text-4xl my-4", className)}>{children}</h2>;
        case "h3":
            return <h3 className={classNames("text-3xl my-4", className)}>{children}</h3>;
        case "h4":
            return <h4 className={classNames("text-2xl", className)}>{children}</h4>;
        case "h5":
            return <h5 className={classNames("text-xl", className)}>{children}</h5>;
        case "h6":
            return <h6 className={classNames("text-lg", className)}>{children}</h6>;
    }
};

export default Title;