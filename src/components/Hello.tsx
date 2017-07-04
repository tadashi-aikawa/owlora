import * as React from "react";
import { Card, Icon, Image, Feed } from 'semantic-ui-react'


export interface HelloProps {
    compiler: string;
    framework: string;
}

export const Hello = (props: HelloProps) =>
    <Card>
        <Card.Content>
            <Card.Header>
                2017/07/04 (Tue)
            </Card.Header>
        </Card.Content>
        <Card.Content>
            <Feed>
                <Feed.Event>
                    <Feed.Label image='https://blog.todoist.com/wp-content/uploads/2015/09/todoist-logo.png' />
                    <Feed.Content>
                        <Feed.Date content='30 min' />
                        <Feed.Summary>
                            Easy task
                        </Feed.Summary>
                    </Feed.Content>
                </Feed.Event>

                <Feed.Event>
                    <Feed.Label image='https://blog.todoist.com/wp-content/uploads/2015/09/todoist-logo.png' />
                    <Feed.Content>
                        <Feed.Date content='1 hours' />
                        <Feed.Summary>
                            Heavy task
                        </Feed.Summary>
                    </Feed.Content>
                </Feed.Event>

                <Feed.Event>
                    <Feed.Label image='https://blog.todoist.com/wp-content/uploads/2015/09/todoist-logo.png' />
                    <Feed.Content>
                        <Feed.Date content='???' />
                        <Feed.Summary>
                            Impossible task
                        </Feed.Summary>
                    </Feed.Content>
                </Feed.Event>
            </Feed>
        </Card.Content>
    </Card>
;

