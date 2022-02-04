import axios from "axios";

const dev = process.env.NODE_ENV === "development";

const getFormDigest = async () => {
  try {
    if (dev) return "";

    const data = await axios.post(
      `${process.env.VUE_APP_API}/contextinfo`,
      {},
      {
        headers: {
          Accept: "application/json; odata=verbose",
          "Content-Type": "application/json; odata=verbose",
        },
        withCredentials: true,
      }
    );

    const formDigest = data.data.d.GetContextWebInformation.FormDigestValue;
    return formDigest;
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

export default getFormDigest;
