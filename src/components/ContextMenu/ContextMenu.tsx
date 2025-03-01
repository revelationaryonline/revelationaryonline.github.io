import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

//  not refactored for use yet
export const ContextMenu = (
  contextMenu: { mouseY: any; mouseX: any; } | null,
  setContextMenu: any,
  verse: any,
  handleClose: ((event: React.MouseEvent<HTMLElement>) => void) | undefined
) => {
  return (
    <Menu
      open={contextMenu !== null}
      onClose={handleClose}
      anchorReference="anchorPosition"
      anchorPosition={
        contextMenu !== null
          ? { top: contextMenu?.mouseY, left: contextMenu?.mouseX }
          : undefined
      }
      elevation={0}
    >
      <MenuItem onClick={(event) => handleClose?.(event)}>Copy</MenuItem>
      {/* <MenuItem onClick={(event) => handleClose?.(event)}>Print</MenuItem> */}
      <MenuItem onClick={(event) => handleClose?.(event)}>Highlight</MenuItem>
      {/* <MenuItem onClick={(event) => handleClose?.(event)}>Email</MenuItem> */}
    </Menu>
  );
};
