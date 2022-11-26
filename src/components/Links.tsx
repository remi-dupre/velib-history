import "../style/Links.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBicycle, faDownload } from "@fortawesome/free-solid-svg-icons";
import { faGithubAlt } from "@fortawesome/free-brands-svg-icons";

export default function Links() {
  return (
    <ul className="links">
      <li>
        <a href="https://www.velib-metropole.fr">
          <FontAwesomeIcon icon={faBicycle} /> Vélib' website
        </a>
      </li>
      <li>
        <a href="https://velib-history-api.dupre.io/dumps/latest">
          <FontAwesomeIcon icon={faDownload} /> Download dump
        </a>
      </li>
      <li>
        <a href="https://github.com/remi-dupre/velib-history">
          <FontAwesomeIcon icon={faGithubAlt} /> Github
        </a>
      </li>
      <li>
        <a href="https://github.com/remi-dupre/gbfs-watcher">
          <FontAwesomeIcon icon={faGithubAlt} /> Github (api)
        </a>
      </li>
    </ul>
  );
}
