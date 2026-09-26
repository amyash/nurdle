import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { InstagramEmbed } from "@/components/instagram-embed";
import { PageShell } from "@/components/page-shell";
import { Section } from "@/components/section";
import { WhatsAppGateTextLink } from "@/components/whatsapp/content-link";

export const metadata: Metadata = {
  title: "Organise a group or corporate beach clean",
  description:
    "Bring your team, class, club or community group to clean a beach with us. Here's what's involved and how to set it up.",
};

const linkClass = "font-bold text-mark underline underline-offset-2";

const sasHome = "https://www.sas.org.uk/";
const millionMile =
  "https://www.sas.org.uk/plastic-pollution/million-mile-clean/";
const millionMileResults =
  "https://www.sas.org.uk/plastic-pollution/million-mile-clean/submit-your-results/";
const millionMileSafety =
  "https://www.sas.org.uk/wp-content/uploads/2025/08/MMC-Safety-Guidelines.pdf";
const nurdling101 =
  "https://drive.google.com/file/d/1xJvS4WuHajxLczOuaVmFP6uByqT35MiU/view?usp=sharing";
const nurdleHunt = "https://www.nurdlehunt.org.uk/take-part.html";
const nurdleHuntHome = "https://nurdlehunt.org.uk";
const riskAssessment =
  "https://docs.google.com/document/d/1_ldMquVhyjat0a4l1K64ZktVB_zDzH8Dp1c9LI2sbiA/edit?usp=sharing";
const ipieca =
  "https://www.ipieca.org/resources/plastic-pellets-clean-up-field-guide";
const northumbrianMap =
  "https://experience.arcgis.com/experience/38baf2cf48d74b8196539ef315bea6b5";
const northumbrianOverflows =
  "https://www.nwl.co.uk/our-region/coasts-and-rivers/about-storm-overflows/";
const beachAccess = "https://beachaccessnortheast.org/";
const emailTemplates =
  "https://docs.google.com/document/d/1GuYL5WO7X-Tk9Nje-3fc6hsO0mj21e_w/edit?usp=sharing";
const portOfBlyth =
  "https://portofblyth.co.uk/nurdles-on-our-beaches-heres-how-you-can-help/";
const queersFacebook =
  "https://www.facebook.com/queersofthenorth/videos/2295206954220085/";
const louisaReel = "https://www.instagram.com/reel/Dcbr76yN9Su/";
const leahPost = "https://www.instagram.com/p/DcdE-WjjYob/";
const waterhaul =
  "https://waterhaul.co/pages/report-fishing-net-ghost-gear";
const what3words = "https://what3words.com/";

function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className={linkClass}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

function SiteLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={linkClass}>
      {children}
    </Link>
  );
}

const prose = "reading-measure space-y-4 text-body text-mute";
const bullets = "list-disc space-y-3 pl-5";

function Subheading({ id, children }: { id?: string; children: string }) {
  return (
    <h3 id={id} className="text-card-title mt-8 scroll-mt-24 text-ink">
      {children}
    </h3>
  );
}

export default function OrganiseAGroupPage() {
  return (
    <PageShell
      narrow
      title="Organise a group or corporate event"
      lead={
        <>
          <p>
            Organising a group or corporate volunteering event is one of the
            best ways to help expand the clean up effort. With over 17 beaches
            now affected by the spill (and counting), hands on the sand are our
            main tool.
          </p>
          <p>
            Lots of people have asked how to set one up, and plenty of groups
            already have. From local litter picker groups and activist networks
            to local companies.
          </p>
          <p>
            This page shows you how they did it and gives you resources to do
            the same. It&apos;s in depth so take your time to read through
            everything and make your plan.
          </p>
          <p>
            Quick check — do you get paid volunteering leave through work? You
            can also use that leave to clean as an independent volunteer. Check
            out <SiteLink href="/how-to-clean">how to clean</SiteLink> for how
            to do this safely whilst managing your own risk.
          </p>
          <p>
            This page focuses on organising group events, where it&apos;s for a
            community group or workplace team.
          </p>
        </>
      }
    >
      <Section id="how-this-works" title="How this works">
        <div className={prose}>
          <p>
            The Nurdle Hub is a collective of concerned citizens with a website
            and not an organisation, charity or company. This means we
            can&apos;t run your event, supervise it or insure it. What we can
            do is show you how others have done it and share the resources to
            help you do it well and safely.
          </p>
          <p>
            The event is yours. You choose the beach, you plan it, and
            you&apos;re responsible for the safety of your group. Everything
            below is here to help you do that.
          </p>
        </div>
      </Section>

      <Section id="covered" title="Make sure you’re covered and equipped">
        <div className={prose}>
          <p>
            You may be covered through your group or company&apos;s insurance;
            best to check this.
          </p>
          <p>
            Otherwise,{" "}
            <Ext href={sasHome}>Surfers Against Sewage (SAS)</Ext> can provide
            cover, for free, and they may be able to help you with
            beach-cleaning kit too.
          </p>
          <p>
            When you register your clean through the{" "}
            <Ext href={millionMile}>SAS Million Mile Clean</Ext> and complete
            their risk assessment and follow its contents, your clean will be
            covered by SAS&apos;s public liability insurance. They&apos;ll also
            post you free equipment for up to 30 people — reusable gloves,
            sacks, hand sanitiser, a sharps box and a first aid kit if you need
            one. Allow about two weeks for it to arrive.
          </p>
          <p>
            The Million Mile Clean is set up for a regular beach clean and
            incorporates specific advice for plastic pellet collection. It
            walks you through every step and the specific equipment you need
            for a pellet collection that differs from a regular beach clean.
            There&apos;s also a process for reporting the results of your clean
            afterwards.
          </p>
        </div>
      </Section>

      <Section id="what-it-involves" title="What a group clean involves">
        <div className={prose}>
          <p>These are the rough steps.</p>
          <ul className={bullets}>
            <li>Gather your people.</li>
            <li>
              Get set up with help from these resources: plan and assess risk.
            </li>
            <li>Let your local council know the group clean is happening.</li>
            <li>
              Assess risk dynamically on the day including tides and weather.
            </li>
            <li>
              Spend a couple of hours collecting plastic pellets (and other
              unwanted rubbish) from the stretch of beach you&apos;ve chosen.
            </li>
          </ul>
          <p>You will need to spend time:</p>
          <ul className={bullets}>
            <li>
              <span className="font-bold text-ink">Choosing a location</span> —
              Picking a beach and a date that suit your group and the tide.
              There are also tips on maximising your chance of finding nurdles
              and rubbish — though note there are no guarantees as nurdles land
              unpredictably influenced by tide and weather conditions. You will
              also want to check recent sewage discharge activity.
            </li>
            <li>
              <span className="font-bold text-ink">Getting kit</span> — Some
              beaches (not all) have equipment stores to borrow from. Find your
              nearest one (
              <SiteLink href="/beaches">
                look for NEST equipment details under each beach listed here
              </SiteLink>
              ), order free kit in advance from{" "}
              <Ext href={millionMile}>SAS Million Mile</Ext>, or source your
              own kit.
            </li>
            <li>
              <span className="font-bold text-ink">Learning how to do it</span>{" "}
              — The{" "}
              <SiteLink href="/how-to-clean">
                how to clean page covers the method
              </SiteLink>
              . Share the Nurdling 101 flyer produced by a local volunteer with
              your group beforehand —{" "}
              <Ext href={nurdling101}>
                download and print the black and white pdf here
              </Ext>
              .
            </li>
            <li>
              <span className="font-bold text-ink">Reporting what you find</span>{" "}
              —{" "}
              <SiteLink href="/beaches">
                Log your haul on the nurdle hub for your chosen beach
              </SiteLink>{" "}
              to track the volunteer response to the Port of Tyne spill. You
              can also complete{" "}
              <Ext href={nurdleHunt}>
                a Great Nurdle Hunt for the UK wide charity Fidra
              </Ext>
              . And if you have registered with Million Mile Clean SAS
              there&apos;s a way to{" "}
              <Ext href={millionMileResults}>
                submit your results with them too
              </Ext>
              .
            </li>
            <li>
              If you find more nurdles than you can collect, or they are in an
              area that isn&apos;t accessible to you, please report them to
              your local authority using{" "}
              <Ext href={what3words}>what three words</Ext> to give an exact
              location.
            </li>
          </ul>
        </div>
      </Section>

      <Section id="logging" title="Logging what you find">
        <div className={prose}>
          <p>
            Here&apos;s how to record your results to add to useful evidence
            bases:
          </p>
          <ol className="list-decimal space-y-3 pl-5">
            <li>
              <span className="font-bold text-ink">
                Log hours and nurdle count for the North of Tyne spill
              </span>{" "}
              — If your clean involves clearing up nurdles from the Port of
              Tyne spill, please register them on the hub, so it adds to our
              local picture of the spill and its impact, and the role of
              volunteers.{" "}
              <SiteLink href="/beaches">
                Register them at your chosen beach here
              </SiteLink>
              .
            </li>
            <li>
              <span className="font-bold text-ink">
                Conduct a Nurdle Hunt survey
              </span>{" "}
              — Contribute to Fidra&apos;s national citizen-science project.
              Spend ten minutes recording how many nurdles you can find, and{" "}
              <Ext href={nurdleHuntHome}>submit it to nurdlehunt.org.uk</Ext>.
              It works even if you found none. There&apos;s even a free app
              with a built-in counter.
            </li>
            <li>
              <span className="font-bold text-ink">
                Submit your results to the{" "}
                <Ext href={millionMileResults}>Million Mile Clean</Ext> with
                SAS
              </span>{" "}
              if you pre-registered your event with them.
            </li>
            <li>
              <span className="font-bold text-ink">
                Submit your findings to your local authority
              </span>{" "}
              if they have their own reporting system — for the Port of Tyne
              spill we are trying to track how each local authority wants to
              receive information on{" "}
              <SiteLink href="/report-nurdles">
                the Nurdle Hub reporting page
              </SiteLink>
              .
            </li>
          </ol>
        </div>
      </Section>

      <Section id="your-responsibility" title="Your event, your responsibility">
        <div className={prose}>
          <p>This is the part you can&apos;t skip.</p>
          <p>You will need to:</p>
          <ul className={bullets}>
            <li>
              Do your own risk assessment. You&apos;ll need to follow your own
              group&apos;s or organisation&apos;s policies and create a risk
              assessment that honours your group&apos;s needs and the context
              and location you&apos;ll be working in. We have generic risk
              assessments to get you started but you must adapt them.
            </li>
            <li>
              Organisations that have already led group sessions have
              contributed their risk assessments which have been combined into{" "}
              <Ext href={riskAssessment}>
                this generic risk assessment (google doc, view only)
              </Ext>
              .
            </li>
            <li>
              The{" "}
              <Ext href={ipieca}>
                IPIECA Plastic Pellets Clean Up Field Guide document
              </Ext>{" "}
              shares practical, operational guidance to support safe and
              effective recovery following a marine or coastal plastic pellets
              incident. This is very comprehensive to a range of settings and
              types of clean up teams, so choose the parts that are relevant to
              your group and event.
            </li>
            <li>
              Support good hygiene. The longer plastic pellets sit in the sea
              and environment, the more likely they are to carry bacteria,
              including E. coli. Gloves and handwashing are essential, so bring
              both. A large thermos of warm water, soap and a washing up bowl
              is a handy on-the-beach solution when there are no public toilets
              nearby. Most water boards also share information about recent
              storm overflow activity. For example,{" "}
              <Ext href={northumbrianMap}>this map from Northumbrian Water</Ext>{" "}
              shows whether there has been a recent spill or if there is a
              current spill for the areas where it operates the sewage network.
              You can learn more about{" "}
              <Ext href={northumbrianOverflows}>
                Northumbrian Water&apos;s storm overflows on their website
              </Ext>
              .
            </li>
            <li>
              Tell your local council. Let them know the location, date and
              time of your group clean. They may be able to pick up waste if
              they know ahead of time, so let them know as soon as you have
              your date and risk assessment set.
            </li>
            <li>
              Get further advice if needed. If you&apos;re a community group,
              your local voluntary sector support organisation can help you
              with policies and planning. Search for your location and
              &apos;voluntary sector support&apos; to find your local
              organisation.
            </li>
          </ul>

          <Subheading>Understanding access</Subheading>
          <p>
            Some beaches aren&apos;t easy to access.{" "}
            <Ext href={beachAccess}>Beach Access North East</Ext> hires out
            equipment to help some users reach the beach in the North East of
            England, and parts of the sifting process can be done seated if
            other team members bring beach material to one point. You will need
            to assess your chosen location and the needs of your group to work
            out what&apos;s possible.
          </p>

          <Subheading>Choosing a location</Subheading>
          <p>There are two ways to choose:</p>
          <ul className={bullets}>
            <li>
              <span className="font-bold text-ink">
                The easy-to-reach option
              </span>{" "}
              — Your nearest, or the one most people can get to.
            </li>
            <li>
              <span className="font-bold text-ink">The high-nurdle beach</span>{" "}
              — Choose the beach that&apos;s most likely to have the most
              nurdles on it. At the moment, these are Fish Quay (North of the
              Tyne) and Littlehaven and Sandhaven (South of the Tyne). The most
              up to date information is within the{" "}
              <WhatsAppGateTextLink
                linkKey="__community__"
                label="WhatsApp community"
              >
                WhatsApp community
              </WhatsAppGateTextLink>
              . However, there are no guarantees.
            </li>
          </ul>
          <p>
            Decide which matters more for your group. Nurdles are somewhat
            unpredictable and unreliable. There is no guarantee of significant
            numbers of nurdles on any beach on any given day. A back up plan of
            general litter picking means the session is worthwhile either way.
          </p>
          <p>
            Whatever your chosen location, know the tide times, and check for
            as much local information as possible about the chances of being
            cut off and any other beach hazards. And check for storm outflow
            activity. Knowing the nearest toilets and any places for
            refreshments is also a good shout.
          </p>
        </div>
      </Section>

      <Section id="community-group" title="If you’re a community group">
        <div className={prose}>
          <p>
            Scouts, schools, clubs, faith groups, a few families, a group of
            friends. A beach clean suits almost any group, and all ages are
            welcome with the right supervision and following hygiene guidance.
          </p>
          <p>
            Once you&apos;ve done your planning and risk assessments and
            invited your group to your chosen date and location, you&apos;re
            ready to go. The{" "}
            <Ext href={riskAssessment}>generic risk assessment</Ext> on this
            page is aimed at adult groups so do adapt yours for children and
            young people depending on who is part of your group.
          </p>
        </div>
      </Section>

      <Section
        id="workplace"
        title="If you’re a workplace or corporate team"
      >
        <div className={prose}>
          <p>
            Beach cleans have long made for genuinely good team days and
            corporates like Port of Blyth have already organised and run their
            own.
          </p>
          <p>
            If your team hasn&apos;t heard about the spill or taken part yet,
            you can be the one to start it. We&apos;ve got email templates to
            help you make the case from other people in the community who have
            tried this with their organisation.{" "}
            <Ext href={emailTemplates}>
              Here is a word doc hosted on google drive with a couple of
              templates
            </Ext>
            .
          </p>
          <p>
            Then it&apos;s the same as any other group. You will need to follow
            your own organisation&apos;s policies, choose your date and
            location, and do your own risk assessment. Those{" "}
            <Ext href={riskAssessment}>generic risk assessments</Ext> above
            help you but you must adapt these to your own team, context, and
            chosen location.
          </p>
          <p>
            Choose your date and location, follow your organisation&apos;s
            policies, do your risk assessment, check your insurance (or
            register with SAS to get cover) and go.
          </p>
        </div>
      </Section>

      <Section id="on-the-day" title="On the day">
        <div className={prose}>
          <ul className={bullets}>
            <li>
              Wear clothes and shoes that you don&apos;t mind getting sandy.
            </li>
            <li>
              Bring water, plus sun cover, waterproof or warm layers depending
              on the season.
            </li>
            <li>Bring gloves and handwashing facilities.</li>
            <li>
              Do a quick on-arrival check of conditions before you start. There
              is a template list in the{" "}
              <Ext href={riskAssessment}>generic risk assessment template</Ext>{" "}
              to help you to create your own checklist ahead of time (see{" "}
              <a href="#resources" className={linkClass}>
                Resources
              </a>{" "}
              below).
            </li>
            <li>
              Brief everyone before you start. No experience needed, but some
              key principles to follow so everyone can keep themselves safe.
              There is also a suggestion for this in the{" "}
              <Ext href={riskAssessment}>generic risk assessment doc</Ext>.
            </li>
          </ul>
          <p>
            For more on running a clean safely, Surfers Against Sewage&apos;s{" "}
            <Ext href={millionMileSafety}>
              Million Mile Clean Safety Guidelines (pdf download)
            </Ext>{" "}
            are a useful reference.
          </p>

          <Subheading>Groups who have already done it</Subheading>
          <p>
            Real examples of how other groups made it happen and how they found
            it.
          </p>
          <ul className={bullets}>
            <li>
              Port of Blyth organised two clean up mornings at Blyth beach and
              Cambois beach, bringing around 50 volunteers at each event,
              including Port staff, key partners, and members of the local
              community. Read more about their experience and what they
              achieved on{" "}
              <Ext href={portOfBlyth}>
                the news section of the Port of Blyth website
              </Ext>
              .
            </li>
            <li>
              Queers of the North came together at North Shields Fish Quay for
              a group clean on 23rd August and shared their experience{" "}
              <Ext href={queersFacebook}>on facebook</Ext> and Instagram.
            </li>
          </ul>
          <figure className="space-y-2">
            <InstagramEmbed url={louisaReel} title="Louisa’s Instagram reel" />
            <figcaption className="text-meta">Louisa</figcaption>
          </figure>
          <figure className="space-y-2">
            <InstagramEmbed
              url={leahPost}
              title="Photos from the event by Leah Pattem"
            />
            <figcaption className="text-meta">
              Photos from the event by Leah Pattem
            </figcaption>
          </figure>
        </div>
      </Section>

      <Section id="resources" title="Resources">
        <div className={prose}>
          <Subheading>Get covered</Subheading>
          <ul className={bullets}>
            <li>
              <Ext href={millionMile}>
                Register your clean with SAS Million Mile Clean
              </Ext>{" "}
              — for help with free kit for up to 30 people, support with risk
              assessment, and public liability insurance.
            </li>
          </ul>

          <Subheading>Help with planning</Subheading>
          <ul className={bullets}>
            <li>
              Get your corporate on board with{" "}
              <Ext href={emailTemplates}>the email templates</Ext>.
            </li>
            <li>
              SAS{" "}
              <Ext href={millionMileSafety}>
                Million Mile Clean Safety Guidelines
              </Ext>{" "}
              (pdf).
            </li>
            <li>
              Check out the IPIECA pellet-spill guidance —{" "}
              <Ext href={ipieca}>downloadable from this webpage</Ext>.
            </li>
            <li>
              Use the{" "}
              <Ext href={riskAssessment}>generic risk assessment template</Ext>{" "}
              pulled together by volunteers from the Nurdle Hub community as a
              starting point to do your own risk assessment.
            </li>
            <li>
              That risk assessment template includes the on-arrival dynamic
              risk check to complete.
            </li>
          </ul>

          <Subheading>Share more about the importance of collecting nurdles</Subheading>
          <ul className={bullets}>
            <li>
              Nurdling 101 flyer (
              <Ext href={nurdling101}>pdf download, black and white</Ext>) to
              send around to your group ahead of time.
            </li>
          </ul>

          <Subheading>Help with running the clean</Subheading>
          <ul className={bullets}>
            <li>
              Check out{" "}
              <SiteLink href="/how-to-clean">
                our guidance on how to clean
              </SiteLink>{" "}
              featuring kit needed and key techniques.
            </li>
            <li>
              Our <SiteLink href="/beaches">list of affected beaches</SiteLink>.
            </li>
            <li>
              Kit —{" "}
              <SiteLink href="/how-to-clean">
                borrow, buy, or make your own
              </SiteLink>
              .
            </li>
            <li>
              Beach Access North East for{" "}
              <Ext href={beachAccess}>accessibility equipment hire</Ext>.
            </li>
          </ul>

          <Subheading>Make it count</Subheading>
          <ul className={bullets}>
            <li>
              Log your hours and nurdle count{" "}
              <SiteLink href="/beaches">on the hub</SiteLink>, choosing the
              beach you cleaned at.
            </li>
            <li>
              Conduct a timed survey and{" "}
              <Ext href={nurdleHunt}>
                log it on the nation-wide Great Nurdle Hunt
              </Ext>
              .
            </li>
            <li>
              <Ext href={millionMileResults}>Submit your results</Ext> to the
              Million Mile Clean with SAS.
            </li>
          </ul>

          <Subheading>What you can&apos;t reach</Subheading>
          <ul className={bullets}>
            <li>
              If there are a large number of nurdles or nurdles you can&apos;t
              reach you need to report them to your Local Authority.
            </li>
            <li>
              If you find a significant fishing net or rope you can{" "}
              <Ext href={waterhaul}>report your findings to Waterhaul</Ext>,
              who SAS collaborate with. This kind of find is known as
              &apos;ghost gear&apos; — lost, abandoned or discarded fishing gear
              that continues to catch and kill marine life.
            </li>
          </ul>
        </div>
      </Section>
    </PageShell>
  );
}
