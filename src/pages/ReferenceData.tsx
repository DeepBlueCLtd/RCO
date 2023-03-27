import { Box, Card, CardActionArea, CardContent, type Theme, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useMemo } from "react";
import { type CreatePathParams, ResourceContextProvider, useCreatePath, useRedirect } from "react-admin";
import { Outlet, useLocation } from "react-router-dom";

interface CardWithNavigationProps {
  title: string;
  path: CreatePathParams['resource'];
  type?: CreatePathParams['type'],
  active?: boolean
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '&.active': {
      background: theme.palette.primary.light,
      color: theme.palette.common.white,
      '& p': {
        fill: theme.palette.common.white,
      },
    },
  },
  content: {
    height: "150px",
    width: "150px",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  }
}));

const CardWithNavigation = (props: CardWithNavigationProps): React.ReactElement => {
  const { path, title, type = 'list', active } = props;
  const createPath = useCreatePath();
  const styles = useStyles();
  const redirect = useRedirect();
  const to = createPath({ resource: `/reference-data${path}`, type });
  return (
    <Card onClick={() => { redirect(to); }} className={`${styles.root} ${((active !== undefined) && active) ? 'active' : ''}`}>
      <CardActionArea>
        <CardContent className={styles.content}>
          <Typography>{title}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
};

const routes = [
  { path: "/organisation", title: 'Organisation' },
  { path: "/protective-marking", title: 'Protective Marking' },
  { path: "/protective-marking-authority", title: 'Protective Marking Authority' },
  { path: "/department", title: 'Department' },
  { path: "/vault", title: 'Vault' },
  { path: "/platform-originator", title: 'Platform Originator' },
];

export default function ReferenceData(): React.ReactElement {
  const location = useLocation();

  const { resource, title } = useMemo(() => {
    const items = location.pathname.split('/')
    const resource =  items.length > 2 ? items[2] : ''
    const title = routes.find(route => route.path === `/${resource}`)?.title
    return { resource, title };
  }, [location]);

  return (
    <div>
      <Box display="flex" flexWrap="wrap" gap="20px" padding="20px">
        {routes.map((route, index) => (
          <CardWithNavigation key={index} {...route} active={title === route.title} />
        ))}
      </Box>

      {resource.length > 0 && (
        <>
          <Box my={5}>
            <Typography textAlign="center" variant="h4">{title}</Typography>
            <ResourceContextProvider value={resource}>
              <Outlet />
            </ResourceContextProvider>
          </Box>
        </>
      )}
    </div>
  )
}
