import moment from "moment";
import { toast } from "react-toastify";

class Helpers {
  formatNumberWithCommas(number) {
    // Convert the number to a string
    var numberString = number.toString();

    // Use regular expression to add commas
    var formattedNumber = numberString?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return formattedNumber;
  }

  storeToken(token) {
    const d = new Date();
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
    document.cookie = `userToken=${token}; expires=${d.toUTCString()}`;
  }

  getToken() {
    var nameEQ = "userToken=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  eraseToken() {
    document.cookie = "userToken=; Max-Age=-99999999;";
  }

  formatData(data) {
    return data?.data?.map((x) => ({
      ...x?.attributes,
      id: x?.id,
    }));
  }

  formatSingleData(data) {
    return { ...data?.data?.attributes, id: data?.data?.id };
  }

  formatDate = (date, format) => moment(date, format).format().split("T")[0];

  convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  errorHandler(error, message) {
    let res = message || "An error occurred";
    if (error.response) {
      if (error.response.status >= 400 && error.response.status <= 499) {
        res = error.response.data.message;
      }
    } else {
      res = error.message;
    }

    // if(res === "")

    return toast.error(res);
  }

  handleSessionChange = (val, name, setFieldValue) => {
    const value = val.replace(/\//g, "");
    if (!value) {
      setFieldValue(name, value);
      return;
    }
    if (Number.isNaN(Number(value)) || value.length > 8) return;
    setFieldValue(name, value);
    if (value.length === 8) {
      const newValue = `${value.slice(0, 4)}/${value.slice(4)}`;
      setFieldValue(name, newValue);
    }
  };

  handleSessionChange2 = (val, name, setFieldValue) => {
    const formattedValue = val.replace(/[^0-9/]/g, "");

    if (!formattedValue) {
      setFieldValue(name, formattedValue);
      return;
    }

    if (formattedValue.length > 9) return;

    setFieldValue(name, formattedValue);
  };

  commaSeperatedNumber = (val) => {
    return (+val).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });
  };

  onAmountChange = (e, handleChange, setFieldValue, field) => {
    const inputValue = e.target.value;
    if (!inputValue) {
      handleChange(e);
      return;
    }
    const removeComma = +inputValue.replace(/,/g, "");
    if (Number.isNaN(removeComma)) return;
    handleChange(e);
    const commaSeperatedValue = this.commaSeperatedNumber(removeComma);
    setFieldValue(field, commaSeperatedValue);
  };
}

export default Helpers;
