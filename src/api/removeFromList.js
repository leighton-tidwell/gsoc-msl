import axios from "axios";
import { getFormDigest } from ".";

const dev = process.env.NODE_ENV === "development";

const removeFromList = async (listName, id) => {
  try {
    if (dev) return true;

    const data = await axios.post(
      `${process.env.VUE_APP_API}/web/lists/getbytitle('${listName}')/items('${id}')`,
      {},
      {
        headers: {
          Accept: "application/json; odata=verbose",
          "Content-Type": "application/json; odata=verbose",
          "IF-MATCH": "*",
          "X-HTTP-Method": "DELETE",
          "X-RequestDigest": await getFormDigest(),
        },
        withCredentials: true,
      }
    );

    return data;
  } catch (error) {
    if (error.response) {
      return Promise.reject(
        new Error(`${error.response.data} ${error.response.status}`)
      );
    }

    return Promise.reject(
      new Error(`${error.message?.value ? error.message.value : error.message}`)
    );
  }
};

export default removeFromList;
