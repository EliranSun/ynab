import { Title } from "../../atoms";
import { useEffect, useState } from "react";
import translate from "translate";

const TranslatedExpenseName = ({ name }) => {
    const [translatedName, setTranslatedName] = useState(null);
    
    useEffect(() => {
        (async () => {
            const translation = await translate(name, {
                from: 'he',
                to: 'en',
            });
            console.log("translation", translation);
            setTranslatedName(translation);
        })();
    }, [name]);
    
    return <b>{translatedName || name}</b>;
}

const TransactionName = ({ name }) => {
    return (
        <Title dir="">
            <TranslatedExpenseName name={name}/>
        </Title>
    );
};

export default TransactionName;
