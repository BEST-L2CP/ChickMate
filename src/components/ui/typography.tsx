import { cva, VariantProps } from 'class-variance-authority';

const typographyVariant = cva('', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '6xl': 'text-6xl',
    },
    color: {
      default: 'text-cool-gray-900',
      white: 'text-white',
      'primary-600': 'text-primary-orange-600',
      'primary-700': 'text-primary-orange-700',
      'secondary-amber': 'text-secondary-amber',
      'secondary-yellow': 'text-secondary-yellow',
      'gray-700': 'text-cool-gray-700',
      'gray-500': 'text-cool-gray-500',
      'gray-300': 'text-cool-gray-300',
      'gray-100': 'text-cool-gray-100',
      'gray-50': 'text-cool-gray-50',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      bold: 'font-bold',
      black: 'font-black',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
    lineClamp: {
      '1': 'line-clamp-1',
      '2': 'line-clamp-2',
      '3': 'line-clamp-3',
      '4': 'line-clamp-4',
    },
    srOnly: {
      true: 'sr-only',
      false: '',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'default',
    align: 'left',
    weight: 'medium',
  },
});

type AllowedTags = 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

type TypographyProps<T extends AllowedTags = 'p'> = {
  as?: T;
  children: React.ReactNode;
} & VariantProps<typeof typographyVariant> &
  Omit<React.ComponentPropsWithoutRef<T>, 'as'>;

const Typography = <T extends AllowedTags = 'p'>({
  as,
  size,
  color,
  weight,
  align,
  lineClamp,
  children,
  srOnly,
  ...props
}: TypographyProps<T>) => {
  const Component = as || 'p';
  return (
    <Component className={typographyVariant({ size, color, weight, align, lineClamp, srOnly })} {...props}>
      {children}
    </Component>
  );
};

export default Typography;
