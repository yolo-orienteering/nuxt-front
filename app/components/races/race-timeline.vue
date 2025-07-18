<script lang="ts" setup>
import moment from 'moment'
import {Race} from 'src/types/DirectusTypes'
import {formatDate} from 'src/utils/DateUtils'
import {useSyncCenter} from 'src/stores/syncCenter'
import {useRace} from 'src/composables/useRace'
import {useRaceTerrain} from 'src/composables/useRaceTerrain'
import {RaceTerrain} from 'src/classes/RaceFilter'
import Mailchimp from 'components/newsletter/mailchimp.vue'
import {useNewsletter} from 'src/composables/useNewsletter'

const syncCenter = useSyncCenter()
const raceCompose = useRace()
const { getTerrainIcon } = useRaceTerrain()
const {isSubscribed} = useNewsletter()

const props = withDefaults(
  defineProps<{
    races: Race[];
    hideLoadMore?: boolean;
    loading: boolean;
  }>(),
  {
    races: () => [],
    hideLoadMore: false,
  }
);

const emit = defineEmits<{
  (e: "loadMore"): void;
}>();

function loadMore() {
  emit("loadMore");
}

function shouldAddUser(race: Race): boolean {
  return !syncCenter.userIdentifier && !!race.departureLink;
}

function getMonthlyDelimiter(date: string): string {
  const momentDate = moment(date);
  return momentDate.year() > moment().year()
    ? momentDate.locale("de-CH").format("MMMM YY")
    : momentDate.locale("de-CH").format("MMMM");
}

function monthChangeInArray(
  raceId: string,
  firstMonth: boolean = true
): boolean {
  const foundIndex = props.races.findIndex((tmpRace) => tmpRace.id === raceId);
  // race doesn't exist
  if (foundIndex < 0 || !props.races) {
    return false;
  }
  // beginning is always a month change
  if (foundIndex === 0) {
    return firstMonth;
  }

  const sortByDeadline = syncCenter.filter.deadline;

  const previousRace = props.races[foundIndex - 1];
  const currentRace = props.races[foundIndex];

  const previousRaceDate = sortByDeadline
    ? previousRace?.deadline
    : previousRace?.date;
  const currentRaceDate = sortByDeadline
    ? currentRace?.deadline
    : currentRace?.date;

  const monthOfPreviousRace = previousRaceDate
    ? new Date(previousRaceDate).getMonth()
    : undefined;
  const currentMonth = currentRaceDate
    ? new Date(currentRaceDate).getMonth()
    : undefined;
  return monthOfPreviousRace !== currentMonth;
}
</script>

<template>
  <!-- loading animation -->
  <div v-if="props.loading" class="row">
    <div v-for="i in [...Array(10).keys()]" :key="i" class="col-12 q-pb-md">
      <q-item>
        <q-item-section avatar>
          <q-skeleton type="QAvatar" />
        </q-item-section>

        <q-item-section>
          <q-item-label>
            <q-skeleton type="text" />
          </q-item-label>
          <q-item-label caption>
            <q-skeleton type="text" width="65%" />
          </q-item-label>
        </q-item-section>
      </q-item>
    </div>
  </div>

  <!-- races list -->
  <div v-else class="row justify-center">
    <div class="col-12">
      <q-timeline layout="dense">
        <template v-for="(race, raceIndex) in races" :key="race.id">
          <!-- monthly delimiter -->
          <q-timeline-entry v-if="monthChangeInArray(race.id)" heading>
            <div class="row">
              <!-- month name -->
              <div class="col-8">
                {{
                  getMonthlyDelimiter(
                    syncCenter.filter.deadline ? race.deadline! : race.date!
                  )
                }}
              </div>
            </div>
          </q-timeline-entry>

          <!-- newsletter -->
          <q-timeline-entry v-if="raceIndex === 4 && !isSubscribed()" class="bg-dark text-white q-pr-sm" color="white">
            <mailchimp />
          </q-timeline-entry>

          <!-- races -->
          <q-timeline-entry
            :title="race.name!"
            @click="$router.push({ name: 'race', params: { id: race.id } })"
          >
            <!-- date & deadline -->
            <template v-slot:subtitle>
              <div class="row items-center">
                <div class="col-6">
                  {{ formatDate(race.date!, "dd, DD.MM yyyy") }}
                </div>
                <!-- deadline -->
                <div v-if="race.deadline" class="col-6 text-right">
                  <q-btn
                    v-if="shouldAddUser(race)"
                    color="secondary"
                    href="#/settings"
                    rounded
                    size="sm"
                    unelevated
                  >
                    Deine Startzeit
                  </q-btn>

                  <q-chip
                    v-else-if="syncCenter.myDepartures.getDepartureFor(race.id)"
                    color="secondary"
                    rounded
                    size="md"
                    unelevated
                  >
                    {{ syncCenter.myDepartures.getFormatedDeparture(race.id) }}
                  </q-chip>

                  <q-chip
                    v-else
                    :class="[{ 'text-strike': new Date() > new Date(race.deadline!) }]"
                    :outline="!syncCenter.filter.deadline"
                    color="secondary"
                    dense
                  >
                    {{ formatDate(race.deadline!, "dd, DD.MMM") }}
                  </q-chip>
                </div>
              </div>
            </template>
            <!-- title & favorites -->
            <template v-slot:title>
              <div class="row items-center">
                <div class="col-10">
                  {{ race.name }}
                </div>
                <div class="col-2 text-right">
                  <q-btn
                    :outline="
                      !syncCenter.myRaces.find(
                        (myRace) => myRace.id === race.id
                      )
                    "
                    color="primary"
                    dense
                    round
                    @click.stop="raceCompose.addOrRemoveRace(race)"
                  >
                    <q-icon name="bookmark_outline" />
                  </q-btn>
                </div>
              </div>
            </template>
            <!-- text body -->
            <div class="row justify-between items-center">
              <div class="col-auto">
                <span v-if="!!race?.terrain" class="q-mr-xs">
                  <q-icon
                    :name="getTerrainIcon(race.terrain as RaceTerrain)"
                    size="xs"
                    style="margin-top: -4px"
                  />
                </span>
                {{ race.city || race.mapName || "vakant" }}
                {{ race.region ? `(${race.region})` : "" }}
              </div>
            </div>
          </q-timeline-entry>
        </template>
      </q-timeline>
    </div>

    <!-- pagination -->
    <div v-if="!hideLoadMore" class="col-12 text-center q-pb-lg">
      <q-btn outline @click="loadMore()"> Mehr Läufe laden </q-btn>
    </div>
  </div>
</template>
