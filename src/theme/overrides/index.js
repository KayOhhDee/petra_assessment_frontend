import Popover from './Popover';
import Card from './Card';
import Button from './Button';
import Table from './Table';

export default function ComponentsOverrides(theme) {
  return Object.assign(
    Popover(theme),
    Card(theme),
    Button(theme),
    Table(theme),
  );
};