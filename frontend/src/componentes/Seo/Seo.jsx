import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";

const Seo = ({ title, description }) => {
    const location = useLocation();
    const canonical = `https://siennafans.club${location.pathname}`;

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonical} />
        </Helmet>
    );
};

export default Seo;