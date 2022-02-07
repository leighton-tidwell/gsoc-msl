import axios from "axios";

const getPersonnel = async () => {
  const devTestData = [
    {
      Id: 0,
      name: "SrA Test",
    },
    {
      Id: 1,
      name: "SrA Test 1",
    },
    {
      Id: 2,
      name: "SrA Test 2",
    },
    {
      Id: 3,
      name: "SrA Test 3",
    },
    {
      Id: 4,
      name: "SrA Test 4",
    },
    {
      Id: 5,
      name: "SrA Bob",
    },
    {
      Id: 6,
      name: "SrA John",
    },
    {
      Id: 7,
      name: "SrA Weeee",
    },
  ];
  try {
    if (process.env.NODE_ENV === "development") return devTestData;

    const data = await axios.get(
      `${process.env.VUE_APP_API}/web/lists/getbytitle('personnel')/items?$orderby=name asc`,
      {
        headers: {
          Accept: "application/json; odata=verbose",
        },
        withCredentials: true,
      }
    );

    const results = data.data.d.results?.filter(
      (item) => item.name !== "SYSTEM"
    );

    return results;
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

export default getPersonnel;
