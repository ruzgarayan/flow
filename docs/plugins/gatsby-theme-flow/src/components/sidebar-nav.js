import styled from "@emotion/styled";

import PropTypes from "prop-types";

import React, { useRef, useState, useContext } from "react";

import { Link, withPrefix } from "gatsby";

import { size } from "polished";

import { useMixpanel } from "gatsby-plugin-mixpanel";

import { theme, colors } from "../colors";
import {
  IconExpandList,
  IconCollapseList,
  IconExternalLink,
  IconChevronUp,
  getProjectIcon
} from "../ui/icons";
import { smallCaps } from "../utils/typography";
import TrackingLink from "../../../../content/components/tracking-link";

import { NavItemsContext } from "./page-layout";

const ExpandAll = styled.button(smallCaps, {
  display: "flex",
  alignItems: "center",
  marginBottom: 12,
  padding: "4px 0",
  border: 0,
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1.23,
  background: "none",
  outline: "none",
  cursor: "pointer",
  color: "inherit",
  ":hover": {
    opacity: theme.hoverOpacity
  },
  svg: {
    ...size(12),
    marginRight: 8
  }
});

const StyledList = styled.ul({
  marginLeft: 0,
  marginBottom: 32,
  listStyle: "none"
});

const StyledListItem = (props) => {
  const Li = styled.li({
    ...props.extraStyles,
    fontSize: "15px",
    lineHeight: 1.23,
    a: {
      color: "inherit",
      textDecoration: "none",
      ":hover": {
        opacity: theme.hoverOpacity
      },
      "&.active": {
        color: theme.primary,
        pointerEvents: "none"
      }
    }
  });
  return <Li>{props.children}</Li>;
};

const Category = styled.div({
  position: "relative",
  zIndex: 0,
  [StyledList]: {
    position: "relative",
    zIndex: 2
  }
});

const categoryTitleStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingBottom: "12px",
  color: theme.text3,
  fontWeight: "bold",
  fontSize: 13,
  lineHeight: 1.23,
  ...smallCaps,
  svg: size(10),
  "&.active": {
    color: theme.text3
  }
};

const CategoryTitle = styled.div(categoryTitleStyles);
const CategoryLink = styled(Link)(categoryTitleStyles, {
  textDecoration: "none",
  ":hover": {
    opacity: theme.hoverOpacity
  }
});

const DocsetMenuWrapper = styled.div({
  marginBottom: "2rem"
});

const StyledCheckbox = styled.input({
  ...size("100%"),
  cursor: "pointer",
  position: "absolute",
  top: 0,
  left: 0,
  opacity: 0,
  zIndex: 1,
  [`:hover ~ ${CategoryTitle}`]: {
    opacity: theme.hoverOpacity
  },
  ":not(:checked) ~": {
    [`${CategoryTitle} svg`]: {
      transform: "scaleY(-1)"
    },
    [StyledList]: {
      display: "none"
    }
  }
});

const StyledTrackingLink = styled(TrackingLink)(() => ({
  color: "inherit",
  textDecoration: "none",
  ":hover": {
    color: theme.text3
  }
}));

const ProjectIcon = styled.div({
  backgroundSize: "100%",
  height: "1.5em",
  width: "1.5rem",
  marginRight: "0.42rem"
});

function ProjectLink(props) {
  const ProjectLinkContainer = styled.div`
    display: flex;
    margin-bottom: 0.8rem;

    ${ProjectIcon} {
      opacity: 1;
    }

    &:hover {
      ${ProjectIcon} {
        opacity: 0.65;
      }
    }
  `;

  return (
    <ProjectLinkContainer>
      <ProjectIcon css={{ backgroundImage: `url(${props.icons?.color})` }} />
      {props.children}
    </ProjectLinkContainer>
  );
}

const StyledOutlinkIcon = styled(IconExternalLink)(size(14), {
  verticalAlign: -1,
  marginLeft: 8,
  color: theme.text3
});

function isPageSelected(path, pathname) {
  const [a, b] = [withPrefix(path), pathname].map((string) =>
    string.replace(/\/$/, "")
  );
  return a === b;
}

function getStylesForNavItem(page) {
  switch (page) {
    case "FLOW (Token)":
      // TODO: Convert these to tailwind css classes...
      return {
        color: colors.grey.darker,
        backgroundColor: colors.green.lightest,
        padding: "0 0.2rem",
        paddingLeft: "1rem",
        marginLeft: "-1rem",
        borderRadius: "1000px",
        boxShadow: ` 20px 20x 60px #1b63b6,
        -20px -20px 60px #2587f6`
      };
    case "Node Operation Quick Guide":
      return {
        color: colors.grey.dark,
        padding: "0 0.2rem",
        paddingLeft: "1rem",
        marginLeft: "-1rem",
        borderRadius: "1000px",
        boxShadow: ` 20px 20x 60px #1b63b6,
        -20px -20px 60px #2587f6`,
        background: colors.blue.lightest
      };
    default:
      return {};
  }
}

function NavItems(props) {
  const mixpanel = useMixpanel();
  return (
    <StyledList>
      {props.pages.map((page, index) => {
        const pageTitle = page.sidebarTitle || page.title;
        const styles = getStylesForNavItem(pageTitle);
        return (
          <StyledListItem key={index} extraStyles={styles}>
            {page.anchor ? (
              <a href={page.path} target="_blank" rel="noopener noreferrer">
                {pageTitle}
                <StyledOutlinkIcon />
              </a>
            ) : (
              <Link
                className={
                  isPageSelected(page.path, props.pathname) ? "active" : null
                }
                to={page.path}
                title={page.description}
                onClick={(e) => {
                  mixpanel.track(`Homepage_nav_${page.path}_clicked`);
                  props.onLinkClick(e);
                }}
              >
                {pageTitle}
              </Link>
            )}
          </StyledListItem>
        );
      })}
    </StyledList>
  );
}

NavItems.propTypes = {
  pages: PropTypes.array.isRequired,
  pathname: PropTypes.string.isRequired,
  onLinkClick: PropTypes.func
};

export default function SidebarNav(props) {
  const categoriesRef = useRef();
  const docset = useContext(NavItemsContext);

  const [allExpanded, setAllExpanded] = useState(false);
  const categories = props.contents.filter((content) => content.title);
  const [root] = props.contents.filter((content) => !content.title);

  function toggleAll() {
    const checkboxes = Array.from(
      categoriesRef.current.querySelectorAll('input[type="checkbox"]')
    );

    const expanded = !checkboxes.every((checkbox) => checkbox.checked);
    checkboxes.forEach((checkbox) => (checkbox.checked = expanded));
    setAllExpanded(expanded);

    if (props.onToggleAll) {
      props.onToggleAll(expanded);
    }
  }

  function toggleCategory(event) {
    const { value, checked, parentElement } = event.target;

    const checkboxes = parentElement.parentElement.querySelectorAll(
      'input[type="checkbox"]'
    );
    const expanded = Array.from(checkboxes).every(
      (checkbox) => checkbox.checked
    );
    setAllExpanded(expanded);

    if (props.onToggleCategory) {
      props.onToggleCategory(value, checked);
    }
  }

  return (
    <>
      {props.showMainNav && (
        <DocsetMenuWrapper>
          {docset
            .filter(navItem => {
              return !navItem.omitLandingPage;
            })
            .map(navItem => {
              return (
                <StyledTrackingLink
                  key={navItem.url}
                  href={navItem.url}
                  eventName={`Homepage_nav_${navItem.url}_clicked`}
                >
                  <ProjectLink
                    key={navItem.url}
                    icons={getProjectIcon(navItem.icon)}
                  >
                    {navItem.title}
                  </ProjectLink>
                </StyledTrackingLink>
              );
            })}
        </DocsetMenuWrapper>
      )}
      {root && (
        <NavItems
          pages={root.pages}
          pathname={props.pathname}
          onLinkClick={props.onLinkClick}
        />
      )}
      {!props.alwaysExpanded && categories.length > 1 && (
        <ExpandAll onClick={toggleAll}>
          {React.createElement(allExpanded ? IconCollapseList : IconExpandList)}
          {allExpanded ? "Collapse" : "Expand"} all
        </ExpandAll>
      )}
      <div ref={categoriesRef}>
        {categories.map((category, index) => {
          const isSelected = category.pages.some((page) =>
            isPageSelected(page.path, props.pathname)
          );

          const className = isSelected ? "active" : null;
          return (
            <Category key={index}>
              {!props.alwaysExpanded && (
                <StyledCheckbox
                  type="checkbox"
                  value={category.title}
                  onChange={toggleCategory}
                  defaultChecked={isSelected}
                />
              )}
              {props.alwaysExpanded && category.path ? (
                <CategoryLink className={className} to={category.path}>
                  {category.title}
                </CategoryLink>
              ) : (
                <CategoryTitle className={className}>
                  {category.title}
                  {!props.alwaysExpanded && <IconChevronUp />}
                </CategoryTitle>
              )}
              <NavItems
                pages={category.pages}
                pathname={props.pathname}
                onLinkClick={props.onLinkClick}
              />
            </Category>
          );
        })}
      </div>
    </>
  );
}

SidebarNav.propTypes = {
  alwaysExpanded: PropTypes.bool,
  contents: PropTypes.array.isRequired,
  pathname: PropTypes.string.isRequired,
  onToggleAll: PropTypes.func,
  onToggleCategory: PropTypes.func,
  onLinkClick: PropTypes.func
};
