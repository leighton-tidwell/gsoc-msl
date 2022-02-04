import axios from "axios";
import { getFormDigest, getItemTypeForListName } from ".";

const dev = process.env.NODE_ENV === "development";

const insertIntoList = async (listName, itemProperties) => {
  try {
    if (dev) return 2000000;

    itemProperties.__metadata = {
      type: getItemTypeForListName(listName),
    };

    const data = await axios.post(
      `${process.env.VUE_APP_API}/web/lists/getbytitle('${listName}')/items`,
      itemProperties,
      {
        headers: {
          Accept: "application/json; odata=verbose",
          "Content-Type": "application/json; odata=verbose",
          "odata-version": "",
          "X-RequestDigest": await getFormDigest(),
        },
        withCredentials: true,
      }
    );

    const {
      data: {
        d: { Id },
      },
    } = data;

    return Id;
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

export default insertIntoList;
