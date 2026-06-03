import AppBar from "@/Layouts/Components/AppBar";
import {Avatar, Box, IconButton, Toolbar, Typography, Stack, Badge} from "@mui/material";
import React from "react";
import logo from "@/../images/mobile-logo.png";
import {usePage} from "@inertiajs/react";

const MobileMenu = ({list, onClick, permissions}) => {
    const { url } = usePage();

    const handleOnClick = (href) => (e) => {
        e.preventDefault();
        console.log('Mobile menu clicked:', href);
        onClick(href);
    }

    const isActive = (href) => {
        if (!url || !href) return false;

        let result = false;

        // Special case for dashboard/home - must be exact match
        if (href === 'dashboard') {
            result = url === '/' || url === '/dashboard';
        }
        // Special case for logout
        else if (href === 'logout') {
            result = url === '/logout';
        }
        // For routes with .index - match exact path
        else if (href.includes('.index')) {
            const routePart = href.replace('.index', '');
            // Must match /routePart or /routePart/ but NOT /routePart/anything
            result = url === `/${routePart}` || url.startsWith(`/${routePart}?`) || url === `/${routePart}/`;
        }
        // For routes with .create - match exact path
        else if (href.includes('.create')) {
            const routePart = href.replace('.create', '');
            result = url === `/${routePart}/create` || url.startsWith(`/${routePart}/create?`);
        }
        // Default: exact match
        else {
            result = url === `/${href}`;
        }

        console.log('isActive check:', { href, url, result });
        return result;
    }

    return <>
        <AppBar position="fixed" color="primary" sx={{top: 0, zIndex: 1300}}>
            <Toolbar sx={{justifyContent:"center", minHeight: "56px"}}>
                <Avatar src={logo} sx={{ width: 40, height: 40 }} />
            </Toolbar>
        </AppBar>
        <AppBar
            position="fixed"
            color="primary"
            sx={{
                top: 'auto',
                bottom: 0,
                zIndex: 1300,
                boxShadow: '0px -2px 10px rgba(0,0,0,0.1)'
            }}
        >
            <Toolbar
                sx={{
                    justifyContent: "space-around",
                    alignItems: "center",
                    px: 1,
                    minHeight: "56px",
                    gap: 0.5
                }}
            >
                {list && list.length > 0 && list.map((item, index) => {
                    // Skip invalid items
                    if (!item || !item.href || !item.title) return null;

                    const active = isActive(item.href);

                    return (
                        <IconButton
                            key={`${item.href}-${index}`}
                            onClick={handleOnClick(item.href)}
                            sx={{
                                color: active ? "secondary.main" : "rgba(255,255,255,0.7)",
                                flexDirection: "column",
                                borderRadius: 2,
                                padding: "8px 12px",
                                minWidth: "64px",
                                transition: "all 0.3s ease",
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.1)',
                                    color: 'white',
                                },
                                ...(active && {
                                    bgcolor: 'rgba(255,255,255,0.15)',
                                    color: 'white',
                                })
                            }}
                        >
                            <Stack spacing={0.3} alignItems="center">
                                <Box sx={{
                                    transform: active ? 'scale(1.1)' : 'scale(1)',
                                    transition: 'transform 0.3s ease'
                                }}>
                                    {item.icon || null}
                                </Box>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontSize: "0.65rem",
                                        fontWeight: active ? 600 : 400,
                                        lineHeight: 1,
                                        textAlign: "center",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "60px"
                                    }}
                                >
                                    {item.title}
                                </Typography>
                            </Stack>
                        </IconButton>
                    );
                })}
            </Toolbar>
        </AppBar>
    </>
}
export default MobileMenu
