import { StringIsNullOrWhiteSpace } from "../../utils/string-utils";

type CardProps = {
    title: string;
    description: string;
    image?: string;
    iconTitle?: string;
    link: string;
};

export default function Card({
    title,
    description,
    image,
    iconTitle,
    link,
}: CardProps) {
    return (
        <div className="card h-100">
            {!StringIsNullOrWhiteSpace(image) && <img src={image} className="card-img-top" alt={title} />}

            <div className="card-body">
                <h5 className="card-title">
                    {!StringIsNullOrWhiteSpace(iconTitle) && <i className={iconTitle}></i>} {title}
                </h5>

                <p className="card-text">{description}</p>

                {!StringIsNullOrWhiteSpace(link) &&
                    <a href={link} className="btn btn-primary">
                        Ver mais
                    </a>
                }
            </div>
        </div>
    );
}