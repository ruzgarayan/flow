import PropTypes from "prop-types";
import React from "react";
import styled from "@emotion/styled";
import { theme } from "../colors";

const Heading = styled.h1({
  ":not(:last-child)": {
    marginBottom: 8,
  },
});

const Subheading = styled.h3({
  color: theme.text2,
});

export default function PageHeader(props) {
  return (
    <div className="header-wrapper">
      <Heading>{props.title.split(".")[1] || props.title}</Heading>
      {props.description && <Subheading>{props.description}</Subheading>}
    </div>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
};
