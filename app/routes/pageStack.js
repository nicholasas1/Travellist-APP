import { createStackNavigator } from "react-navigation-stack";
import stackOpts from "./stackOpts";
import PageScreen2 from "../components/screens/PageScreen2";

const pageStack = (item) =>
  createStackNavigator(
    {
      PageScreen2: {
        screen: PageScreen2,
        params: {
          uri: item.link,
          backButtonDisabled: true,
        },
      },
    },
    stackOpts
  );

export default pageStack;
