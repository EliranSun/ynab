const Title = ({ children, type }) => {
    switch (type) {
        default:
        case "h1":
            return <h1 className="text-5xl my-4">{children}</h1>;
        case "h2":
            return <h2 className="text-4xl my-4">{children}</h2>;
        case "h3":
            return <h3 className="text-3xl my-4">{children}</h3>;
        case "h4":
            return <h4 className="text-2xl">{children}</h4>;
        case "h5":
            return <h5 className="text-xl">{children}</h5>;
        case "h6":
            return <h6 className="text-lg">{children}</h6>;
    }
};

export default Title;