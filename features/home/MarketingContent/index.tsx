import { FC } from 'react';
import {
  BiExport,
  BiHistory,
  BiLock,
  BiMapAlt,
  BiMessageEdit,
} from 'react-icons/bi';

import { Icon, Image, Separator } from '@/components/atoms';
import { Container, Footer, UnauthenticatedHeader } from '@/components/layout';
import { Route } from '@/types/routes';
import { RouteCard } from '../../routes';
import { HeroSection } from './HeroSection';
import { HorizontalList } from './HorizontalList';
import { IconBanner } from './IconBanner';
import { Section } from './Section';

type MarketingContentProps = {
  routes?: Route[];
};

export const MarketingContent: FC<MarketingContentProps> = ({ routes }) => {
  return (
    <>
      <UnauthenticatedHeader />
      <Container>
        <main>
          <HeroSection />
          <IconBanner icon={BiMapAlt}>
            <p>
              Venturing into the backcountry brings with it inherent risks. No
              matter your planned activity, know the risks and plan your trip
              safely with <b>OutRoutes</b>.
            </p>
          </IconBanner>
          <Section>
            <Section.StickyColumn>
              <Image
                src='/images/canyoneering.jpg'
                alt='Canyoneering'
                width={640}
                height={640}
                objectFit='cover'
              />
            </Section.StickyColumn>
            <Section.ScrollColumn>
              <Section.ColumnRow>
                <Section.RowContent>
                  <Icon as={BiMessageEdit} size='2xl' />
                  <h2>Community-driven route betas</h2>
                  <Separator width='1-4' height='md' colorScale={900} />
                  <p>
                    Find a route that&apos;s inaccurate or out of date? Submit a
                    change request with the correct information, or clone the
                    route and fix it yourself.
                  </p>
                </Section.RowContent>
              </Section.ColumnRow>
              <Section.ColumnRow>
                <Section.RowContent>
                  <Icon as={BiHistory} size='2xl' />
                  <h2>Keep track of changes over time</h2>
                  <Separator width='1-4' height='md' colorScale={900} />
                  <p>
                    Each route has it&apos;s own history, so you&apos;ll never
                    lose track of your work. See who changed what and when the
                    changes were made. Soon you&apos;ll be able to revert
                    changes, too.
                  </p>
                </Section.RowContent>
              </Section.ColumnRow>
            </Section.ScrollColumn>
          </Section>
          <Section>
            <Section.ScrollColumn>
              <Section.ColumnRow>
                <Section.RowContent>
                  <Icon as={BiLock} size='2xl' />
                  <h2>Public and private route visibility</h2>
                  <Separator width='1-4' height='md' colorScale={900} />
                  <p>
                    If you prefer to keep your routes hidden from the public,
                    you can easily do so. Both public and private routes can add
                    additional members who have elevated privileges, decided by
                    the route owner.
                  </p>
                </Section.RowContent>
              </Section.ColumnRow>
              <Section.ColumnRow>
                <Section.RowContent>
                  <Icon as={BiExport} size='2xl' />
                  <h2>Export summaries and GPS coordinates</h2>
                  <Separator width='1-4' height='md' colorScale={900} />
                  <p>
                    Public routes will always have free export of all route
                    details - including GPS coordinates. Multiple export options
                    are coming soon including CSV, PDF, GPX, and KML.
                    You&apos;ll also be able to download details from your own
                    routes, public or private.
                  </p>
                </Section.RowContent>
              </Section.ColumnRow>
            </Section.ScrollColumn>
            <Section.StickyColumn>
              <Image
                src='/images/mountain-climbing.jpg'
                alt='Mountain Climbing'
                width={640}
                height={640}
                objectFit='cover'
              />
            </Section.StickyColumn>
          </Section>
          {Array.isArray(routes) && routes.length > 0 && (
            <HorizontalList title='Recently Updated Routes'>
              {routes.map((route) => {
                const {
                  id,
                  owner,
                  is_private,
                  slug,
                  title,
                  image_card_banner,
                  static_image_card_banner,
                  stats_favorites,
                } = route;

                return (
                  <HorizontalList.ListItem key={id}>
                    <RouteCard
                      orientation='vertical'
                      image={image_card_banner || static_image_card_banner}
                      username={owner?.username}
                      slug={slug}
                      is_private={is_private}
                      title={title}
                      stats_favorites={stats_favorites}
                      showFavoriteBtn={false}
                    />
                  </HorizontalList.ListItem>
                );
              })}
            </HorizontalList>
          )}
        </main>
        <Footer />
      </Container>
    </>
  );
};
