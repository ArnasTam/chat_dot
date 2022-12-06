import React from "react";
import { Avatar, Dropdown, Grid, Link, Navbar, Text } from "@nextui-org/react";
import { GrChatOption } from "react-icons/gr";
import { useAppDispatch } from "../../../hooks/hooks";
import { getUsername, logOut } from '../../../store/auth_slice'
import { useLocation, useNavigate } from "react-router-dom";

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogOut = () => {
    dispatch(logOut());
    navigate("/login");
  };

  return (
    <Navbar maxWidth="fluid" isBordered variant="sticky">
      <Navbar.Toggle showIn="xs" />
      <Navbar.Brand
        css={{
          "@xs": {
            w: "150px",
          },
        }}
      >
        <Grid.Container css={{ p: "20px" }} direction="row" justify="center">
          <GrChatOption size="25px" />
          <Text size="25px" b color="inherit">
            Chat.
          </Text>
        </Grid.Container>
      </Navbar.Brand>
      <Navbar.Content
        enableCursorHighlight
        hideIn="xs"
        activeColor="neutral"
        variant="underline"
      >
        <Navbar.Link
          isActive={location.pathname === "/"}
          onClick={() => {
            navigate("/");
          }}
        >
          Home
        </Navbar.Link>
        <Navbar.Link
          isActive={location.pathname === "/servers"}
          onClick={() => {
            navigate("/servers");
          }}
        >
          Servers
        </Navbar.Link>
      </Navbar.Content>
      <Navbar.Content
        css={{
          "@xs": {
            w: "12%",
            jc: "flex-end",
          },
        }}
      >
        <Dropdown placement="bottom-right">
          <Navbar.Item>
            <Dropdown.Trigger>
              <Avatar
                bordered
                as="button"
                color="gradient"
                size="md"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Very_Black_screen.jpg/2560px-Very_Black_screen.jpg"
              />
            </Dropdown.Trigger>
          </Navbar.Item>
          <Dropdown.Menu
            aria-label="User menu actions"
            onAction={(actionKey) => {
              if (actionKey === "logout") {
                handleLogOut();
              }
              if (actionKey === "home") {
                navigate("/");
              }
              if (actionKey === "servers") {
                navigate("/servers");
              }
            }}
          >
            <Dropdown.Item key="profile" css={{ height: "$18" }}>
              <Text b color="inherit" css={{ d: "flex" }}>
                Signed in as {getUsername()}
              </Text>
            </Dropdown.Item>

            <Dropdown.Item key="home" withDivider>
              Home
            </Dropdown.Item>
            <Dropdown.Item key="servers">Servers</Dropdown.Item>
            <Dropdown.Item key="logout" withDivider color="error">
              Log Out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Navbar.Content>
      <Navbar.Collapse disableAnimation>
        <Navbar.CollapseItem>
          <Link
            color="text"
            onClick={() => {
              navigate("/");
            }}
          >
            Home
          </Link>
        </Navbar.CollapseItem>
        <Navbar.CollapseItem>
          <Link
            color="text"
            onClick={() => {
              navigate("/servers");
            }}
          >
            Servers
          </Link>
        </Navbar.CollapseItem>
        <Navbar.CollapseItem>
          <Link color="error" onClick={handleLogOut}>
            Log Out
          </Link>
        </Navbar.CollapseItem>
      </Navbar.Collapse>
    </Navbar>
  );
}
