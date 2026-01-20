import { FC, ReactNode } from 'react';

interface WillRenderProps {
  when: boolean;
  children: ReactNode;
}

const WillRender: FC<WillRenderProps> = (props) => {
    const { when = false, children } = props;

    if (!when) {
        return null;
    }

    return <>{children}</>;
};

export default WillRender;
